# 📊 Continental Dashboard  
*React + TypeScript dashboard for guest engagement analytics*

## 🚀 Quick Start  
```bash
npm install
npm run dev
npm run test
```

## 🛠 Implementation  
### Data Flow  
- **API Mocking**: `fetchGuests()` in `/src/api/` with 300ms delay  
- **Filters**: Multi-select by status (tested in `GuestList.test.tsx`)  
- **Chart**: Recharts

### Styling  
- **SCSS Architecture**:  
  ```
  styles/
  ├── main.scss       # Central import  
  ├── _variables.scss # Design tokens  
  └── components/     # BEM-scoped partials  
  ```  
- **Why**: Optimized for large-scale maintainability  

## GuestList Component  
```tsx
<GuestList />
```  

**Purpose**: Displays and filters all Continental guests with their statuses and affiliations  

### Core Features  
- 🔍 **Multi-Filter System**:  
  ```ts
  type FilterType = 'all' | 'active' | 'excommunicado' | 'pending' | 'deceased' | 'retired'
  ```  
  - Toggle multiple filters simultaneously  
  - Clear all filters with one click

- 🏷️ **Guest Status Tracking**:  
  - Priority-sorted status badges (`GuestStatusBadge`)  
  - Visual indicators for:  
    - Unpaid markers (severity levels)  
    - Active bounties  
    - Excommunicado status  

- 🏨 **Hotel Affiliation**:  
  - Shows current Continental hotel for each guest  
  - "No affiliation" state for unregistered guests  

### Technical Implementation  
- 📡 **Data Handling**:  
  - Fetches guests and hotels via `useMockApi`  
  - Sorts guests by status priority:  
    ```ts
    ['Active', 'Pending', 'Retired', 'Revoked', 'Excommunicado', 'Deceased']
    ```  

- ⚙️ **Filter Logic**:  
  - Uses `useEffect` dependencies for efficient re-filtering  
  - Maintains filter state while avoiding unnecessary re-renders  

- 🛡️ **Error States**:  
  - Handles API failures with themed error messages  
  - Loading state with Continental-themed UI  

### UI/UX Elements  
- Filter tags show active selections  
- Responsive grid layout  
- Visual hierarchy for critical information (bounties/markers)  
- Empty state when no filters match  

## HotelList Component  
```tsx
<HotelList />
```

**Purpose**: Displays all Continental Hotels with their current guests and statuses  

### Key Features  
- 📡 **Data Fetching**:  
  - Uses `useMockApi` to fetch hotels and guests data  
  - Handles loading/error states with elegant fallback UI  

- 🏨 **Hotel Display**:  
  - Shows hotel details (name, location, manager)  
  - Visual status badges (`GuestStatusBadge`)  
  - Lists house rules for each location  

- 🕴️ **Guest Management**:  
  - Filters and sorts guests by status priority:  
    ```ts
    ['Excommunicado', 'Revoked', 'Deceased', 'Active', 'Retired']
    ```  
  - Displays guest details with `GuestStatusBadge` components  
  - Highlights unpaid markers (red badge)  

- 🎨 **Styling**:  
  - Responsive grid layout (1-3 columns)  
  - Continental-themed colors and shadows  

### Technical Notes  
- Type-safe props/interfaces (`Hotel`, `Guest` types)  
- Data validation for `activeGuests` array  
- Pure UI component (state managed internally)