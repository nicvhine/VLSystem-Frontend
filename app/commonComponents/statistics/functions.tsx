import { StatCardProps } from "../utils/Types/statsType";

export function StatCard({ label, value, icon: Icon, isAmount = false }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-red-600" />
          <h4 className="text-sm font-medium text-gray-600">{label}</h4>
        </div>
        <p className="text-xl font-semibold text-gray-900">
          {isAmount ? `₱${value.toLocaleString()}` : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
