'use client';

import { useEffect, useState } from "react";
import { Calendar as RBC, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import loanOfficerTranslations from '../components/translation';

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
  const [language, setLanguage] = useState<'en' | 'ceb'>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("loanOfficerLanguage") as 'en' | 'ceb') || 'en';
    }
    return 'en';
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

  const t = loanOfficerTranslations[language];

  const [events, setEvents] = useState<InterviewEvent[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [date, setDate] = useState(new Date());

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);


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
  
    if (app.status?.trim().toLowerCase() !== "pending") {
      window.location.href = `/components/loanOfficer/applications/${app.applicationId}`;
    } else {
      setSelectedApp(app);
      setShowModal(true);
    }
  };
  

  const handleViewApplication = () => {
    if (!selectedApp) return;
    window.location.href = `/components/loanOfficer/applications/${selectedApp.applicationId}`;
  };

  const handleEditSchedule = () => {
    if (!selectedApp) return;
    window.location.href = `/components/loanOfficer/applications/${selectedApp.applicationId}/edit-schedule`;
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



 {/* Modal */}
{showModal && selectedApp && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-200"
      onClick={(e) => e.stopPropagation()} 
    >
      {/* Header */}
<div
  className={`mb-6 p-4 rounded ${
    selectedApp.status?.trim().toLowerCase() === "pending" &&
    selectedApp.interviewDate &&
    new Date(selectedApp.interviewDate) < new Date()
      ? "bg-red-100 border border-red-400"
      : ""
  }`}
>
  <h3 className="text-2xl font-bold text-gray-800">{selectedApp.appName}</h3>
  <p className="text-gray-600 mt-1">
    <strong>{t.homeAddress}: </strong>
    <span>{selectedApp.appAddress || "N/A"}</span>
  </p>
  <p className="text-gray-600 mt-1">
    <strong>{t.status}: </strong>
    <span
      className={`font-semibold ${
        selectedApp.status?.trim().toLowerCase() === "pending"
          ? new Date(selectedApp.interviewDate || "") < new Date()
            ? "text-red-600"
            : "text-yellow-600"
          : "text-green-600"
      }`}
    >
      {selectedApp.status || "Pending"}
    </span>
  </p>
</div>


      {/* Editable Fields */}
      {selectedApp.status?.trim().toLowerCase() === "pending" && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          <label className="flex flex-col text-gray-700 font-medium">
            {t.date}
            <input
              type="date"
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedApp.interviewDate || ""}
              onChange={(e) =>
                setSelectedApp({ ...selectedApp, interviewDate: e.target.value })
              }
            />
          </label>

          <label className="flex flex-col text-gray-700 font-medium">
            {t.time}
            <input
              type="time"
              className="mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedApp.interviewTime || ""}
              onChange={(e) =>
                setSelectedApp({ ...selectedApp, interviewTime: e.target.value })
              }
            />
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleViewApplication}
        >
{t.viewApplication}
        </button>

        {selectedApp.status?.trim().toLowerCase() === "pending" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                  `http://localhost:3001/loan-applications/${selectedApp.applicationId}/schedule-interview`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      interviewDate: selectedApp.interviewDate,
                      interviewTime: selectedApp.interviewTime,
                    }),
                  }
                );
                if (!res.ok) throw new Error("Failed to update schedule");

                // Update local state
                setEvents((prev) =>
                  prev.map((evt) =>
                    evt.applicationId === selectedApp.applicationId
                      ? {
                          ...evt,
                          start: new Date(
                            `${selectedApp.interviewDate}T${selectedApp.interviewTime}`
                          ),
                          end: new Date(
                            new Date(
                              `${selectedApp.interviewDate}T${selectedApp.interviewTime}`
                            ).getTime() + 60 * 60 * 1000
                          ),
                        }
                      : evt
                  )
                );

                setShowModal(false);
              } catch (err) {
                console.error(err);
                alert("Failed to save changes");
              }
            }}
          >
{t.saveChanges}
          </button>
        )}
      </div>
    </div>
  </div>
)}




      </div>
    </div>
  );
}
