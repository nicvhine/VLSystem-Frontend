'use client';

import { useEffect, useState } from "react";
// @ts-ignore: react-big-calendar lacks bundled TypeScript definitions in this project
import { Calendar as RBC, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import InterviewModal from "@/app/commonComponents/modals/calendarModal/modal";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import translations from "@/app/commonComponents/translation";

import SuccessModal from "@/app/commonComponents/modals/successModal/modal";
import ErrorModal from "@/app/commonComponents/modals/errorModal/modal";

interface InterviewEvent {
  title: string;
  start: Date;
  end: Date;
  applicationId: string;
}

interface Application {
  _id: string;
  appName: string;
  appContact: string;
  appEmail: string;
  appAddress: string;
  interviewDate?: string;
  interviewTime?: string;
  status?: string;
  applicationId: string;
  appliedDate?: string;
}

// Calendar localization setup
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface InterviewCalendarProps {
  onModalToggle?: (isOpen: boolean) => void;
}

/**
 * Interview calendar component for loan officers
 * Displays scheduled interviews and allows scheduling management
 */
export default function InterviewCalendar({ onModalToggle }: InterviewCalendarProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  // All hooks must be at the top level
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("loanOfficerLanguage") as 'en' | 'ceb') || 'en';
    }
    return 'en';
  });
  const [events, setEvents] = useState<InterviewEvent[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [date, setDate] = useState(new Date());
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert applications with interview data to calendar events
  const mapApplicationsToEvents = (apps: Application[]): InterviewEvent[] =>
    apps
      .filter(app => app.interviewDate && app.interviewTime)
      .map(app => {
        const [hourStr = "0", minuteStr = "0"] = (app.interviewTime ?? "00:00").split(":");
        const [yearStr = "1970", monthStr = "1", dayStr = "1"] = (app.interviewDate ?? "1970-01-01").split("-");
        const start = new Date(
          Number(yearStr) || 1970,
          (Number(monthStr) || 1) - 1,
          Number(dayStr) || 1,
          Number(hourStr) || 0,
          Number(minuteStr) || 0
        );
        const end = new Date(start);
        end.setHours(end.getHours() + 1);

        return {
          title: `${app.appName}`,
          start,
          end,
          applicationId: app.applicationId,
        };
      });

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail.userType === 'loanOfficer') {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const t = translations.calendarTranslation[language];

  // Fetch interview data from API
  useEffect(() => {
    async function fetchInterviews() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/loan-applications/interviews", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          console.error("Failed to fetch interviews:", res.status, res.statusText);
          return;
        }

        const data: Application[] = await res.json();

        setEvents(mapApplicationsToEvents(data));
        setApplications(data);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInterviews();
  }, []);

  // Handle event selection to open interview modal
  const handleSelectEvent = (event: InterviewEvent) => {
    const app = applications.find(a => a.applicationId === event.applicationId);
    if (!app) return;
    setSelectedApp(app);
    setShowModal(true);
    onModalToggle?.(true);
  };

  // Close interview modal
  const handleCloseModal = () => {
    setShowModal(false);
    onModalToggle?.(false);
  };

  // Save interview schedule changes
  const handleSaveChanges = async (date: string, time: string) => {
    if (!selectedApp) return;
  
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/loan-applications/${selectedApp.applicationId}/schedule-interview`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ interviewDate: date, interviewTime: time })
      });
  
      if (res.ok) {
        setModalMsg("Schedule updated!");
        setShowSuccessModal(true);
        const updatedApplications = applications.map(app =>
          app.applicationId === selectedApp.applicationId
            ? { ...app, interviewDate: date, interviewTime: time }
            : app
        );
        setApplications(updatedApplications);
        setEvents(mapApplicationsToEvents(updatedApplications));
        setSelectedApp(prev => (prev ? { ...prev, interviewDate: date, interviewTime: time } : prev));
        handleCloseModal();
      } else {
        setModalMsg("Failed to update schedule");
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  // Navigate to application details page
  const handleViewApplication = (applicationId: string) => {
    window.location.href = `/commonComponents/loanApplication/${applicationId}`;
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner size={6} />
        </div>
      ) : (
      <>
      {showSuccessModal && (
        <SuccessModal isOpen={showSuccessModal} message={modalMsg} onClose={() => setShowSuccessModal(false)} />
      )}
      {showErrorModal && (
        <ErrorModal isOpen={showErrorModal} message={modalMsg} onClose={() => setShowErrorModal(false)} />
      )}
      <div className="bg-white p-4 rounded shadow text-black">
  <h2 className="text-xl font-semibold mb-4 text-black">{t.c1}</h2>
  {/* @ts-ignore: react-big-calendar type incompatibility with React 18+ */}
  <RBC
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  selectable
  views={['month', 'week', 'day', 'agenda']}
  view={view}
  onView={(newView: View) => {
    // Only allow supported views
    if (['month', 'week', 'day', 'agenda'].includes(newView)) {
      setView(newView);
    }
  }}
  date={date}
  onNavigate={(newDate: Date) => setDate(newDate)}
  popup
  style={{ height: "75vh" }}
  onSelectEvent={handleSelectEvent}
  messages={{
    today: t.c2,
    previous: t.c3,
    next: t.c4,
    month: t.c5,
    week: t.c6,
    day: t.c7,
    agenda: t.c8,
    date: t.c9,
    time: t.c10,
    event: t.c11,
    noEventsInRange: t.c12,
    showMore: (total: number) => `+${total} more`
  }}
  eventPropGetter={(event: InterviewEvent) => {
    const app = applications.find(a => a.applicationId === event.applicationId);
    let baseClass = "";
    const now = new Date();
    const isPending = app?.status?.trim().toLowerCase() === "pending";
    const interviewDateTime = app?.interviewDate && app?.interviewTime 
      ? new Date(`${app.interviewDate}T${app.interviewTime}`) 
      : null;
    if (isPending && interviewDateTime && interviewDateTime < now) {
      baseClass = "overdue-interview";
    } else if (isPending) {
      baseClass = "pending-interview";
    } else {
      baseClass = "completed-interview";
    }
    return {
      className: baseClass,
      style: {
        padding: "2px 6px",
        borderRadius: 6,
        background: "#a0a7b4", // fallback if needed
        cursor: "pointer"
      }
    };
  }}
  components={{
    event: ({ event }: { event: InterviewEvent }) => {
      // Truncate to 12 chars, show tooltip, but let bar fill cell
      const display = event.title.length > 12 ? event.title.slice(0, 12) + "..." : event.title;
      return (
        <span
          title={event.title}
          style={{
            display: "inline-block",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle"
          }}
        >
          {display}
        </span>
      );
    }
  }}
/>


      </div>
      <InterviewModal
        show={showModal}
        onClose={handleCloseModal}
        applicationId={selectedApp?.applicationId || ""}
        currentDate={selectedApp?.interviewDate}
        currentTime={selectedApp?.interviewTime}
        onSave={handleSaveChanges}
        onView={handleViewApplication}
        appliedDate={selectedApp?.appliedDate}
      />
      </>
      )}
    </div>
  );
}
