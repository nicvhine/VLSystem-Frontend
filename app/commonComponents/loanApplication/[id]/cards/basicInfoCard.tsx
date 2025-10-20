"use client";
import { BasicInfoCardProps } from "@/app/commonComponents/utils/Types/components";

export default function BasicInfoCard({ application, l }: BasicInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-grow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{l.t1}</h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{l.t5}</p>
          <p className="text-gray-900">{application?.appDob || "—"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{l.t6}</p>
          <p className="text-gray-900">{application?.appAddress || "—"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{l.t7}</p>
          <p className="text-gray-900">{application?.appMarital || "—"}</p>
        </div>

        {application?.appMarital === "Married" && (
          <>
            <div>
              <p className="text-sm font-medium text-gray-500">{l.t8}</p>
              <p className="text-gray-900">{application?.appSpouseName || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{l.t9}</p>
              <p className="text-gray-900">
                {application?.appSpouseOccupation || "—"}
              </p>
            </div>
          </>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">{l.t10}</p>
          <p className="text-gray-900">{application?.appChildren || "—"}</p>
        </div>
      </div>
    </div>
  );
}
