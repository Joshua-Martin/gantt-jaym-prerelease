import { useState } from 'react';
import { useGanttStore } from '../../hooks/useGanttStore';
import { calculateTodayLocation } from '../../utils/ganttUtils';
/**
 * Component that renders a vertical line indicating the current date in the Gantt chart
 *
 * @param {number} height - The total height of the Gantt chart
 * @returns {JSX.Element} SVG group containing the today marker line and label
 *
 * The marker consists of a dashed vertical line and a "Today" label at the top
 */
const TodayMarker: React.FC<{ height: number }> = ({ height }) => {
  const [isHovered, setIsHovered] = useState(false);
  const startDate = useGanttStore(state => state.startDate);
  const dayWidth = useGanttStore(state => state.dayWidth);

  // Calculate x position based on days from start
  const x = calculateTodayLocation(startDate, dayWidth);

  return (
    <g style={{ isolation: 'isolate' }}>
      {/* Invisible hover area */}
      <rect
        x={x - (dayWidth - 4) / 2}
        y={0}
        width={dayWidth - 4}
        height={height}
        fill="#60A5FA70"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
      />
      {/* Vertical line */}
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="white" // blue-400
        strokeWidth={3}
        strokeDasharray="4 4"
      />
      {/* Today label - only shown when hovered */}
      {isHovered && (
        <g transform={`translate(${x - 18}, 0)`}>
          <rect x={0} y={0} width={36} height={20} rx={4} fill="#60A5FA" />
          <text x={18} y={14} textAnchor="middle" fill="white" fontSize={12}>
            Today
          </text>
        </g>
      )}
    </g>
  );
};

export default TodayMarker;
