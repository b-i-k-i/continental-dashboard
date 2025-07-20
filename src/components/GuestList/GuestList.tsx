import { useEffect, useState } from 'react';
import { useMockApi } from '../../api/useApi';

import { GuestStatusBadge } from '../GuestStatusBadge/GuestStatusBadge';

type Guest = {
  id: string;
  name: string;
  status: string;
  specialty: string;
  markersOwed: number;
  lastLocation: string;
};

type Hotel = {
  id: string;
  name: string;
  location: string;
  activeGuests: string[];
};

export const GuestList = () => {
  const { getHotels, getGuests } = useMockApi();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, guestData] = await Promise.all([getHotels(), getGuests()]);
        setHotels(hotelData);
        setGuests(guestData);
      } catch (error) {
        console.error('Failed to fetch Continental records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGuestHotel = (guestId: string) => {
    return hotels.find(hotel => hotel.activeGuests.includes(guestId));
  };

  if (loading) return <div className="loading">Consulting the High Table...</div>;

  return (
    <div className="guest-list">
      <h2>Current Continental Guests</h2>
      <ul>
        {guests.map(guest => {
          const hotel = getGuestHotel(guest.id);
          
          return (
            <li key={guest.id} className="guest-card">
              <h3>{guest.name}</h3>
              <GuestStatusBadge statuses={guest.status} />
              <p><strong>Specialty:</strong> {guest.specialty}</p>
              <p><strong>Last seen:</strong> {guest.lastLocation}</p>
              {hotel && (
                <div className="hotel-affiliation">
                  <p>Affiliated with: <strong>{hotel.name}</strong></p>
                  <small>{hotel.location}</small>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};