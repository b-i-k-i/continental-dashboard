import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts';
import mockData from '@/api/mockData.json';

interface GuestStatusChartProps {
  onStatusClick: (status: string) => void;
  activeFilter?: string | null;
}

export const GuestStatusChart = ({ onStatusClick, activeFilter }: GuestStatusChartProps) => {
  const statusData = mockData.guests.reduce((acc, guest) => {
    guest.status.forEach(s => {
      const existing = acc.find(item => item.name === s);
      existing ? existing.count++ : acc.push({ 
        name: s, 
        count: 1,
        id: s.toLowerCase().replace(/\s+/g, '-')
      });
    });
    return acc;
  }, [] as { name: string; count: number; id: string }[]);

  return (
    <section 
      className="guest-status-chart"
      aria-labelledby="chart-title"
      role="region"
    >
      <h3 id="chart-title">Guest Status Distribution</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart
            role="img"
            aria-label="Pie chart showing distribution of guest statuses"
          >
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="count"
              nameKey="name"
              onClick={(_, index) => onStatusClick(statusData[index].name)}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
              aria-label="Guest status segments"
            >
              {statusData.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  id={entry.id}
                  className={`status-${entry.id} ${activeFilter === entry.name ? 'active-segment' : ''}`}
                  style={{ cursor: 'pointer' }}
                  aria-label={`${entry.name} status: ${entry.count} guests`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onStatusClick(entry.name);
                    }
                  }}
                />
              ))}
              <Label
                value={`Total Guests: ${mockData.guests.length}`}
                position="center"
                className="chart-center-label"
              />
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} ${value === 1 ? 'guest' : 'guests'}`,
                `Status: ${name}`
              ]}
              contentStyle={{
                backgroundColor: 'var(--bg-continental-darker)',
                borderColor: 'var(--color-gold)',
                color: 'var(--text-color)'
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              onClick={(data) => onStatusClick(data.value)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};