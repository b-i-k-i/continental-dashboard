import { useEffect, useState } from 'react';
import { useMockApi } from '../../api/useApi';
import type { Hotel, Guest, GuestStatus } from '../../types';
import { GuestStatusBadge } from '../GuestStatusBadge/GuestStatusBadge';

export const HotelList = () => {
  const { getHotels, getGuests } = useMockApi();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, guestData] = await Promise.all([
          getHotels(),
          getGuests()
        ]);

        const validatedHotels = hotelData.map(hotel => ({
          ...hotel,
          activeGuests: Array.isArray(hotel.activeGuests) ? hotel.activeGuests : []
        }))

        setHotels(validatedHotels);
        setGuests(guestData);
      } catch (error) {
        console.error('Failed to fetch Continental data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getHotelGuests = (hotelId: string) => {
    // Server-specific data error debuggery
    // console.log('Current hotels data:', JSON.stringify(hotels, null, 2));
    // console.log('Current guests data:', JSON.stringify(guests, null, 2));

    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel || !Array.isArray(hotel?.activeGuests)) return [];
    
    return guests
      .filter(guest => hotel.activeGuests.includes(guest.id))
      .sort((a, b) => {
        const statusPriority: GuestStatus[] = [
          'Excommunicado',
          'Revoked',
          'Deceased',
          'Active',
          'Retired'
        ];
        return (
          Math.min(...a.status.map(s => statusPriority.indexOf(s))) -
          Math.min(...b.status.map(s => statusPriority.indexOf(s)))
        );
      });
  };

  if (loading) return (
    <div className="text-center animate-pulse">
      Consulting the Guest Register...
    </div>
  );

  return (
    <div className="hotel-list">
      <h2 className="hotel-list__title">
        Continental Hotels Worldwide
      </h2>
      
      <div className="hotel-list__wrapper">
        {hotels.map(hotel => (
          <div key={hotel.id} className="hotel-list__card">
            
            <h3 className="hotel-list__hotel--name">{hotel.name}</h3>
            <p className="hotel-list__hotel--location">{hotel.location}</p>
            <p className="hotel-list__hotel--manager">
              Manager: <span>{hotel.manager}</span>
            </p>
            
            <div className="hotel-list__card--guest-section">
              <h4>Current Guests:</h4>
              {getHotelGuests(hotel.id).length > 0 ? (
                <ul className="space-y-4">
                  {getHotelGuests(hotel.id).map(guest => (
                    <li key={guest.id} className="hotel-list__card--guest-item">
                      <div className="">
                        <div>
                          <p className="hotel-list__card--guest-item name">{guest.name}</p>
                          <p className="hotel-list__card--guest-item location">
                            Last seen: {guest.lastLocation}
                          </p>
                        </div>
                        {guest.markersOwed > 0 && (
                          <span className="hotel-list__card--guest-item markers">
                            {guest.markersOwed} UNPAID MARKER(S)
                          </span>
                        )}
                      </div>
                      <div className="hotel-list__card--guest-item status">
                        <GuestStatusBadge 
                          statuses={guest.status} 
                          guestId={guest.id}  // Properly typed
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="hotel-list__no-guests">
                  No guests currently checked in
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};