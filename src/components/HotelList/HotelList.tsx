import { useEffect, useState } from 'react';
import { useMockApi } from '../../api/useApi';
import type { Hotel, Guest, GuestStatus } from '../../types';
import { GuestStatusBadge } from '../GuestStatusBadge/GuestStatusBadge';
import { HotelStatusBadge } from '../HotelStatusBadge/HotelStatusBadge';

export const HotelList = () => {
  const { getHotels, getGuests } = useMockApi();
  const [hotels, setHotels] = useState<Hotel[]>([]); // Explicit type
  const [guests, setGuests] = useState<Guest[]>([]); // Explicit type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, guestData] = await Promise.all([
          getHotels(), // Returns Promise<Hotel[]>
          getGuests()  // Returns Promise<Guest[]>
        ]);
        setHotels(hotelData);
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
    console.log('Current hotels data:', JSON.stringify(hotels, null, 2));
    console.log('Current guests data:', JSON.stringify(guests, null, 2));

    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) return [];
    
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
    <div className="text-center py-8 text-continental-gold animate-pulse">
      Consulting the Guest Register...
    </div>
  );

  return (
    <div className="hotel-list max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-continental-gold border-b border-continental-gold pb-4 mb-8">
        Continental Hotels Worldwide
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map(hotel => (
          <div key={hotel.id} className="relative hotel-card bg-continental-dark text-continental-light p-6 rounded-lg border-l-4 border-continental-gold shadow-xl hover:shadow-2xl transition-shadow">
            <div className="absolute top-4 right-4">
              <HotelStatusBadge status={hotel.status} />
            </div>
            
            <h3 className="text-xl font-bold pr-8">{hotel.name}</h3>
            <p className="location italic text-continental-light/70 mt-1">{hotel.location}</p>
            <p className="manager mt-2 font-medium">
              Manager: <span className="text-continental-gold">{hotel.manager}</span>
            </p>
            
            <div className="guest-section mt-6 p-4 bg-continental-darker/80 rounded-lg">
              <h4 className="font-bold mb-3 text-lg">Current Guests:</h4>
              {getHotelGuests(hotel.id).length > 0 ? (
                <ul className="space-y-4">
                  {getHotelGuests(hotel.id).map(guest => (
                    <li key={guest.id} className="guest-item pb-3 border-b border-continental-darkest/50 last:border-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-medium text-continental-light">{guest.name}</p>
                          <p className="text-sm mt-1 text-continental-gold/80">
                            Last seen: {guest.lastLocation}
                          </p>
                        </div>
                        {guest.markersOwed > 0 && (
                          <span className="bg-red-900/90 text-red-100 px-2 py-1 rounded text-xs whitespace-nowrap">
                            {guest.markersOwed} UNPAID MARKER(S)
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <GuestStatusBadge 
                          statuses={guest.status} 
                          guestId={guest.id}  // Properly typed
                        />
                      </div>
                      <p className="text-sm mt-1">
                        Specialty: <span className="text-continental-gold/80">{guest.specialty}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-guests italic text-continental-light/50 text-center py-4">
                  No guests currently checked in
                </p>
              )}
            </div>

            <div className="rules mt-6">
              <h4 className="font-bold mb-3 text-lg">House Rules:</h4>
              <ul className="space-y-3">
                {hotel.rules.map((rule, i) => (
                  <li key={`rule-${i}-${hotel.id}`} className="flex items-start">
                    <span className="text-continental-gold mr-2 mt-1">•</span>
                    <span className="text-continental-light/90">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};