import { StatCardProps } from "../utils/Types/statsType";

export function StatCard({ label, value, icon: Icon, isAmount = false }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-red-600" />
          <h4 className="text-xs font-medium text-gray-600">{label}</h4>
        </div>
        <p className="text-sm font-semibold text-gray-900">
          {isAmount ? `₱${value.toLocaleString()}` : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
