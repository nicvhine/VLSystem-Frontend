"use client";
import { FiUser } from "react-icons/fi";
import { ProfileCardProps } from "@/app/commonComponents/utils/Types/components";

export default function ProfileCard({ application }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 flex-shrink-0">
      <div className="p-6 text-center">
        {/* Profile Image */}
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 border-4 border-white shadow-lg">
          {application?.profilePic &&
          typeof application.profilePic === "object" &&
          (application.profilePic as any).filePath ? (
            <img
              src={
                (application.profilePic as any).filePath.startsWith("http")
                  ? (application.profilePic as any).filePath
                  : `http://localhost:3001/${
                      (application.profilePic as any).filePath
                    }`
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-profile.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiUser className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Name and Contact */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {application?.appName || "—"}
        </h2>
        <p className="text-red-600 font-medium mb-1">
          {application?.appContact || "—"}
        </p>
        <p className="text-gray-600 text-sm">{application?.appEmail || "—"}</p>
      </div>
    </div>
  );
}
