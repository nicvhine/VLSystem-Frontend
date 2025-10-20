import React from "react";
import { LoanDetails, Props } from "@/app/commonComponents/utils/type";
import { DetailRow} from "../function";
import { formatDate, formatCurrency, capitalizeWords } from "@/app/commonComponents/utils/formatters";

export default function PersonalInfo({ client }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* General Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">General Information</h3>
        <div className="space-y-2">
          <DetailRow label="Address" value={client.address || "-"} />
          <DetailRow label="Date of Birth" value={client.appDob || "-"} />
          <DetailRow label="Marital Status" value={client.appMarital || "-"} />
          {client.appMarital === "Married" && (
            <>
              <DetailRow label="Spouse Name" value={client.appSpouseName || "-"} />
              <DetailRow label="Spouse Occupation" value={client.appSpouseOccupation || "-"} />
            </>
          )}
          <DetailRow label="Number of Children" value={client.appChildren ?? "-"} />
        </div>
      </section>

      {/* Contact Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Contact Information</h3>
        <div className="space-y-2">
          <DetailRow label="Contact Number" value={client.contactNumber || "-"} />
          <DetailRow label="Email Address" value={client.emailAddress || "-"} />
        </div>
      </section>

      {/* Income Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Income Information</h3>
        <div className="space-y-2">
          <DetailRow label="Source of Income" value={capitalizeWords(client.sourceOfIncome)} />
          {client.sourceOfIncome?.toLowerCase() === "business" && (
            <>
              <DetailRow label="Business Type" value={capitalizeWords(client.businessType)} />
              <DetailRow label="Date Started" value={formatDate(client.dateStarted)} />
              <DetailRow label="Location" value={capitalizeWords(client.businessLocation)} />
            </>
          )}
          {client.sourceOfIncome?.toLowerCase() === "employed" && (
            <>
              <DetailRow label="Occupation" value={capitalizeWords(client.appOccupation)} />
              <DetailRow label="Employment Status" value={capitalizeWords(client.appEmploymentStatus)} />
            </>
          )}
          <DetailRow label="Monthly Income" value={formatCurrency(client.appMonthlyIncome)} />
        </div>
      </section>
    </div>
  );
}
