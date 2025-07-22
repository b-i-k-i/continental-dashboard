export type GuestStatus = 
  | 'Active'
  | 'Retired'
  | 'Deceased'
  | 'Revoked'
  | 'Excommunicado'
  | 'Pending';

export type Guest = {
  id: string;
  name: string;
  status: GuestStatus[];
  specialty: string;
  markersOwed: number;
  lastLocation: string;
  codename: string;
  markersFulfilled: number;
  activeBounty: number;
};

export type Hotel = {
  id: string;
  name: string;
  status: 'Consecrated' | 'Deconsecrated';
  location: string;
  manager: string;
  rules: string[];
  activeGuests: string[];
};