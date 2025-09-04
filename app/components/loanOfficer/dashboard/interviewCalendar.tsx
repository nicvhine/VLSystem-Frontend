'use client';

import { useEffect, useState } from "react";
import { Calendar as RBC, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

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
              title: `Interview: ${app.appName}`, 
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
        <h2 className="text-xl font-semibold mb-4">Scheduled Interviews</h2>
        <RBC
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  selectable
  views={["month", "week", "day", "agenda"]}
  view={view}
  onView={(newView) => setView(newView)}
  date={date}
  onNavigate={(newDate) => setDate(newDate)}
  popup
  style={{ height: "75vh" }}
  onSelectEvent={handleSelectEvent}
  eventPropGetter={(event: InterviewEvent) => {
    const app = applications.find(a => a.applicationId === event.applicationId);
    if (!app) return { className: "" };

    const now = new Date();
    const isPending = app.status?.trim().toLowerCase() === "pending";

    const interviewDateTime = app.interviewDate && app.interviewTime 
      ? new Date(`${app.interviewDate}T${app.interviewTime}`) 
      : null;

    if (isPending && interviewDateTime && interviewDateTime < now) {
      return { className: "overdue-interview" }; 
    } else if (isPending) {
      return { className: "pending-interview" };
    } else {
      return { className: "completed-interview" };
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
    <strong>Home Address: </strong>
    <span>{selectedApp.appAddress || "N/A"}</span>
  </p>
  <p className="text-gray-600 mt-1">
    <strong>Status: </strong>
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
            Date
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
            Time
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
          View Application
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
            Save Changes
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
