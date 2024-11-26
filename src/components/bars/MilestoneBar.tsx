/**
 * Renders a milestone marker in the Gantt chart.
 * Milestones are represented as diamond shapes with status-based coloring.
 */
import React from 'react';
import { useGanttStore } from '../../hooks/useGanttStore';
import { calculateBarPosition } from '../../utils/ganttUtils';
import { ProcessedTask, ProcessedProject } from '../../types/ganttTypes';

interface MilestoneBarProps {
  item: ProcessedTask | ProcessedProject;
  y: number;
  size?: number;
}

export const MilestoneBar: React.FC<MilestoneBarProps> = ({ item, y, size = 24 }) => {
  const { dayWidth, startDate } = useGanttStore();
  const { x } = calculateBarPosition(item.startDate, item.endDate, startDate, dayWidth);
  const halfSize = size / 2;

  // Calculate diamond points
  const points = `
    ${x},${y + halfSize} 
    ${x + halfSize},${y} 
    ${x + size},${y + halfSize} 
    ${x + halfSize},${y + size}
  `;

  return (
    <g>
      <polygon
        points={points}
        fill={item.colorHex}
        className="opacity-90"
        stroke={item.isCritical ? '#FCA5A5' : 'none'}
        strokeWidth={item.isCritical ? 2 : 0}
      />
    </g>
  );
};

export default MilestoneBar;
