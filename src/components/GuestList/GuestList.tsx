import { useEffect, useState } from 'react';
import { useMockApi } from '../../api/useApi';
import { GuestStatusBadge } from '../GuestStatusBadge/GuestStatusBadge';
import type { Guest, Hotel } from '../../types';
// import { GuestStatusChart } from '../GuestStatusChart/GuestStatusChart';

type FilterType = 'all' | 'active' | 'excommunicado' | 'pending' | 'deceased' | 'retired';

export const GuestList = () => {
  const { getHotels, getGuests } = useMockApi();
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['all']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hotelData, guestData] = await Promise.all([
          getHotels(),
          getGuests()
        ]);
        
        const sortedGuests = guestData.sort((a, b) => {
          const statusPriority: Record<string, number> = {
            'Active': 1,
            'Pending': 2,
            'Retired': 3,
            'Revoked': 4,
            'Excommunicado': 5,
            'Deceased': 6
          };
          
          const aPriority = Math.min(...a.status.map(s => statusPriority[s] || 7));
          const bPriority = Math.min(...b.status.map(s => statusPriority[s] || 7));
          return aPriority - bPriority;
        });

        setHotels(hotelData);
        setAllGuests(sortedGuests);
        setFilteredGuests(sortedGuests);
      } catch (error) {
        console.error('Failed to fetch Continental records:', error);
        setError('Failed to access High Table database. Please consult your local concierge.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterGuests = () => {
      if (activeFilters.includes('all') || activeFilters.length === 0) {
        setFilteredGuests(allGuests);
        return;
      }

      const filtered = allGuests.filter(guest => {
        return activeFilters.every(filter => {
          return guest.status.includes(
            filter === 'active' ? 'Active' :
            filter === 'excommunicado' ? 'Excommunicado' :
            filter === 'pending' ? 'Pending' :
            filter === 'retired' ? 'Retired' :
            'Deceased'
          );
        });
      });
      setFilteredGuests(filtered);
    };

    filterGuests();
  }, [activeFilters, allGuests]);

  const getGuestHotel = (guestId: string) => {
    return hotels.find(hotel => 
      hotel?.activeGuests?.includes(guestId)
    );
  };

  const getMarkerSeverity = (count: number, statuses: string[]) => {
    // Excommunicado (living) guests are always high severity
    if (statuses.includes("Excommunicado") && !statuses.includes("Deceased")) {
      return 'high';
    }
    
    // Normal marker-based severity
    if (count === 0) return 'none';
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  };

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev => {
      if (filter === 'all') {
        return prev.includes('all') ? [] : ['all'];
      }
      
      if (prev.includes('all')) {
        return [filter];
      }
      
      if (prev.includes(filter)) {
        const newFilters = prev.filter(f => f !== filter);
        return newFilters.length === 0 ? ['all'] : newFilters;
      } else {
        return [...prev, filter];
      }
    });
  };

  const isFilterActive = (filter: FilterType) => {
    return activeFilters.includes(filter);
  };

  const clearAllFilters = () => {
    setActiveFilters(['all']);
  };

  if (loading) return (
    <div className="loading">
      <div className="continental-loader"></div>
      <p>Consulting the High Table...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <h2>Access Denied</h2>
      <p>{error}</p>
      <small>Error Code: 47B-12 (Unauthorized Continental Access)</small>
    </div>
  );

  return (
    <div className="guest-list">
      <div className="list-header">
        <h2>
          <span className="gold-text">Continental Guest Ledger</span>
          <span className="badge">{filteredGuests.length} of {allGuests.length} shown</span>
        </h2>
        
        <div className="filters-container">
          <div className="filters">
            <button 
              className={isFilterActive('all') ? 'active-filter' : ''}
              onClick={() => toggleFilter('all')}
            >
              All Guests
            </button>
            <button 
              className={isFilterActive('active') ? 'active-filter' : ''}
              onClick={() => toggleFilter('active')}
            >
              Active
            </button>
            <button 
              className={isFilterActive('excommunicado') ? 'active-filter' : ''}
              onClick={() => toggleFilter('excommunicado')}
            >
              Excommunicado
            </button>
            <button 
              className={isFilterActive('pending') ? 'active-filter' : ''}
              onClick={() => toggleFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={isFilterActive('deceased') ? 'active-filter' : ''}
              onClick={() => toggleFilter('deceased')}
            >
              Deceased
            </button>
            <button 
              className={isFilterActive('retired') ? 'active-filter' : ''}
              onClick={() => toggleFilter('retired')}
            >
              Retired
            </button>
          </div>
          {(!activeFilters.includes('all') || activeFilters.length > 1) && (
            <button className="clear-filters" onClick={clearAllFilters}>
              Clear Filters
            </button>
          )}
        </div>
        {!activeFilters.includes('all') && activeFilters.length > 0 && (
          <div className="active-filters-display">
            <span>Showing: </span>
            {activeFilters.map(filter => (
              <span key={filter} className="filter-tag">
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </span>
            ))}
          </div>
        )}
      </div>

      <ul className="guest-grid">
        {filteredGuests.length > 0 ? (
          filteredGuests.map(guest => {
            const hotel = getGuestHotel(guest.id);
            const markerSeverity = getMarkerSeverity(guest.markersOwed, guest.status);
            const hasBounty = guest.activeBounty > 0;
            const isExcommunicado = guest.status.includes("Excommunicado") && !guest.status.includes("Deceased");
            
            return (
              <li key={guest.id} className={`guest-card ${markerSeverity}-marker`}>
                <div className="guest-header">
                  <h3>
                    {guest.name} 
                    {guest.codename && <span className="codename"> | "{guest.codename}"</span>}
                  </h3>
                  <GuestStatusBadge 
                    statuses={guest.status} 
                    guestId={guest.id} 
                  />
                  {hasBounty ? (
                    <div className="bounty active-bounty">
                      <span className="coin-icon">🪙</span>
                      <span>${guest.activeBounty.toLocaleString()} Contract</span>
                    </div>
                  ) : isExcommunicado ? (
                    <div className="bounty excommunicado-warning">
                      <span className="warning-icon">⚠️</span>
                      <span>Bounty Eligible</span>
                    </div>
                  ) : null}
                </div>

                <div className="guest-details">
                  <p><strong>Specialty:</strong> {guest.specialty}</p>
                  <p><strong>Last seen:</strong> {guest.lastLocation}</p>
                  
                  {guest.markersOwed > 0 && (
                    <div className="marker-alert">
                      <span className="marker-icon">⚡</span>
                      <span>{guest.markersOwed} unpaid marker(s)</span>
                      <small>Severity: {markerSeverity}</small>
                    </div>
                  )}

                  {hotel ? (
                    <div className="hotel-affiliation">
                      <p>
                        <strong>Affiliated with:</strong> 
                        <span className="hotel-name">{hotel.name}</span>
                      </p>
                      <small>
                        <span className="hotel-id">{hotel.id}</span> • {hotel.location}
                      </small>
                    </div>
                  ) : (
                    <div className="hotel-affiliation none">
                      <p>No current Continental affiliation</p>
                    </div>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <div className="no-results">
            <p>No guests found matching the selected filters</p>
            <small>Consult the High Table for more information</small>
          </div>
        )}
      </ul>
    </div>
  );
};