'use client';

import { useEffect, useState } from "react";
import { Calendar as RBC, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import loanOfficerTranslations from '../components/translation';
import InterviewModal from "@/app/commonComponents/modals/calendarModal/modal";

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
}

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function InterviewCalendar() {
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

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail.userType === 'loanOfficer') {
        setLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  const t = loanOfficerTranslations[language];

  // (moved above)


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

        const mappedEvents: InterviewEvent[] = data
          .filter(app => app.interviewDate && app.interviewTime)
          .map(app => {
            const [hours, minutes] = app.interviewTime!.split(":").map(Number);
            const [year, month, day] = app.interviewDate!.split("-").map(Number);
            const start = new Date(year, month - 1, day, hours, minutes);
            const end = new Date(start);
            end.setHours(end.getHours() + 1);

            return { 
              title: `${app.appName}`, 
              start, 
              end,
              applicationId: app.applicationId
            };
          });

        setEvents(mappedEvents);
        setApplications(data);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      }
    }

    fetchInterviews();
  }, []);

  const handleSelectEvent = (event: InterviewEvent) => {
    const app = applications.find(a => a.applicationId === event.applicationId);
    if (!app) return;
    setSelectedApp(app);
    setShowModal(true);
  };

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
        alert("Schedule updated!");
        setShowModal(false);
      } else {
        alert("Failed to update schedule");
      }
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  const handleViewApplication = (applicationId: string) => {
    window.location.href = `/commonComponents/loanApplication/${applicationId}`;
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow text-black">
  <h2 className="text-xl font-semibold mb-4 text-black">{t.scheduledInterviews}</h2>
  {/* @ts-ignore: react-big-calendar type incompatibility with React 18+ */}
  <RBC
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  selectable
  views={['month', 'week', 'day', 'agenda']}
  view={view}
  onView={(newView) => {
    // Only allow supported views
    if (['month', 'week', 'day', 'agenda'].includes(newView)) {
      setView(newView as typeof view);
    }
  }}
  date={date}
  onNavigate={(newDate) => setDate(newDate)}
  popup
  style={{ height: "75vh" }}
  onSelectEvent={handleSelectEvent}
  messages={{
    today: t.today,
    previous: t.back,
    next: t.next,
    month: t.month,
    week: t.week,
    day: t.day,
    agenda: t.agenda,
    date: t.date,
    time: t.time,
    event: t.event,
    noEventsInRange: t.noEventsInRange,
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
        onClose={() => setShowModal(false)}
        applicationId={selectedApp?.applicationId || ""}
        currentDate={selectedApp?.interviewDate}
        currentTime={selectedApp?.interviewTime}
        onSave={handleSaveChanges}
        onView={handleViewApplication}
      />
    </div>
  );
}
