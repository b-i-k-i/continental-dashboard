import type { Hotel } from '../../types';

const statusStyles = {
  'Consecrated': 'bg-green-900/80 text-green-100 border-green-700',
  'Deconsecrated': 'bg-red-900/80 text-red-100 border-red-700'
} as const;

interface HotelStatusBadgeProps {
  status: Hotel['status']; // This ensures we only get valid hotel statuses
}

export const HotelStatusBadge = ({ status }: HotelStatusBadgeProps) => {
  // Add null check in case status is undefined
  if (!status) {
    return null; // or return a default badge if preferred
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-mono border ${
        statusStyles[status]
      } shadow-sm`}
      title={
        status === 'Consecrated' 
          ? 'Sanctuary active' 
          : 'Sanctuary revoked'
      }
    >
      {status.toUpperCase()} {/* Now safe to call toUpperCase() */}
    </span>
  );
};