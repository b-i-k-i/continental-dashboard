import type { GuestStatus } from '../../types';

const statusStyles: Record<GuestStatus, string> = {
  'Active': 'active',
  'Retired': 'retired',
  'Deceased': 'deceased',
  'Revoked': 'revoked',
  'Excommunicado': 'excommunicado'
};

interface GuestStatusBadgeProps {
  statuses: GuestStatus[];
  guestId: string; // Add guestId to create unique keys
}

export const GuestStatusBadge = ({ statuses, guestId }: GuestStatusBadgeProps) => {
  const sortedStatuses = [...statuses].sort((a, b) => {
    const priorityOrder: GuestStatus[] = [
      'Excommunicado', 
      'Revoked', 
      'Deceased', 
      'Active', 
      'Retired'
    ];
    return priorityOrder.indexOf(a) - priorityOrder.indexOf(b);
  });

  return (
    <div className="guest-status-badge">
      {sortedStatuses.map((status, index) => (
        <span
          key={`${guestId}-${status}-${index}`} // Unique key combining guestId, status, and index
          className={`${statusStyles[status]}-badge`}
          title={getStatusTooltip(status)}
        >
          {status.toUpperCase()}
        </span>
      ))}
    </div>
  );
};

const getStatusTooltip = (status: GuestStatus): string => {
  const tooltips = {
    'Active': 'Currently accepting contracts',
    'Retired': 'Not taking new contracts',
    'Deceased': 'Deceased (rules still apply)',
    'Revoked': 'Membership revoked by High Table',
    'Excommunicado': 'All services denied - bounty active'
  };
  return tooltips[status];
};