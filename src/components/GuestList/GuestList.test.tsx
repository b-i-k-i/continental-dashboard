import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestList } from './GuestList';
import type { Guest } from '../../types';

const mockGuests: Guest[] = [
  {
    id: "JH-001",
    name: "Jonathan Wick",
    codename: "Baba Yaga",
    status: ["Retired", "Pending"],
    specialty: "Improvised weaponry",
    markersOwed: 1,
    markersFulfilled: 1,
    lastLocation: "Greece",
    activeBounty: 14000000
  },
  {
    id: "JH-002",
    name: "Cassian",
    codename: "The Silent Blade",
    status: ["Active"],
    specialty: "Close-quarters combat",
    markersOwed: 0,
    markersFulfilled: 0,
    lastLocation: "Paris",
    activeBounty: 0
  },
  {
    id: "EX-001",
    name: "Viggo Tarasov",
    codename: "The Butcher",
    status: ["Excommunicado"],
    specialty: "Brute force",
    markersOwed: 3,
    markersFulfilled: 0,
    lastLocation: "New York",
    activeBounty: 5000000
  },
  {
    id: "DC-001",
    name: "Marcus",
    codename: "The Watcher",
    status: ["Deceased"],
    specialty: "Sniper",
    markersOwed: 0,
    markersFulfilled: 2,
    lastLocation: "Unknown",
    activeBounty: 0
  }
];

jest.mock('../../api/useApi', () => ({
  useMockApi: () => ({
    getGuests: jest.fn(() => Promise.resolve(mockGuests)),
    getHotels: jest.fn(() => Promise.resolve([]))
  })
}));

describe('GuestList Component', () => {
  const user = userEvent.setup();

  it('loads and displays guests from API', async () => {
    render(<GuestList />);
    expect(await screen.findByText('Jonathan Wick')).toBeInTheDocument();
    expect(screen.getByText('Cassian')).toBeInTheDocument();
  });

  it('shows active filters in the correct display container', async () => {
    render(<GuestList />);
    
    await user.click(await screen.findByRole('button', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'Pending' }));
  
    const filtersDisplay = screen.getByText('Showing:').parentElement;
    expect(filtersDisplay).toHaveClass('active-filters-display');
    
    const filterTags = within(filtersDisplay!).getAllByTestId('filter-tag');
    expect(filterTags).toHaveLength(2);
    expect(filterTags[0]).toHaveTextContent('Active');
    expect(filterTags[1]).toHaveTextContent('Pending');
  });

  it('resets filters with Clear Filters button', async () => {
    render(<GuestList />);
    await user.click(await screen.findByRole('button', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'Clear Filters' }));
    expect(screen.queryByText('Showing:')).not.toBeInTheDocument();
    expect(screen.getByText('4 of 4 shown')).toBeInTheDocument();
  });

  it('resets filters with All Guests button', async () => {
    render(<GuestList />);
    await user.click(await screen.findByRole('button', { name: 'Excommunicado' }));
    await user.click(screen.getByRole('button', { name: 'All Guests' }));
    expect(screen.queryByText('Showing:')).not.toBeInTheDocument();
  });

  it('renders status badges for all guests', async () => {
    render(<GuestList />);
    const jonathanCard = (await screen.findByText('Jonathan Wick')).closest('li');
    const cassianCard = screen.getByText('Cassian').closest('li');
    
    expect(within(jonathanCard!).getByText('RETIRED')).toBeInTheDocument();
    expect(within(cassianCard!).getByText('ACTIVE')).toBeInTheDocument();
  });

  it('shows no results state for incompatible filters', async () => {
    render(<GuestList />);
    
    await user.click(await screen.findByRole('button', { name: /active/i }));
    await user.click(screen.getByRole('button', { name: /deceased/i }));
  
    const noResults = await screen.findByTestId('no-results-message');
    
    // Verify key semantic content (not exact wording)
    expect(noResults).toHaveTextContent(/no .*found/i); // "No guests found", "No results found", etc
    expect(noResults).toHaveTextContent(/consult/i); // Catches "Consult..." or "Check with..."
    
    // Optional: Verify it's visible
    expect(noResults).toBeVisible();
  });
});