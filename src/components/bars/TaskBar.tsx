import React from 'react';
import { useGanttStore } from '../../hooks/useGanttStore';
import { calculateBarPosition } from '../../utils/ganttUtils';
import { ProcessedTask } from '../../types/ganttTypes';

interface TaskBarProps {
  task: ProcessedTask;
  y: number;
  height: number;
}

export const TaskBar: React.FC<TaskBarProps> = ({ task, y, height }) => {
  const { dayWidth, startDate } = useGanttStore();
  const { x, width } = calculateBarPosition(task.startDate, task.endDate, startDate, dayWidth);
  const cornerRadius = 6;

  return (
    <g transform={`translate(${x},${y})`}>
      <path
        d={`
          M ${cornerRadius} 0
          H ${width - cornerRadius}
          Q ${width} 0 ${width} ${cornerRadius}
          V ${height - cornerRadius}
          Q ${width} ${height} ${width - cornerRadius} ${height}
          H ${cornerRadius}
          Q 0 ${height} 0 ${height - cornerRadius}
          V ${cornerRadius}
          Q 0 0 ${cornerRadius} 0
        `}
        fill={task.colorHex}
        className="opacity-50"
      />

      {/* Progress bar */}
      <rect
        x={0}
        y={0}
        width={width * (task.progress / 100)}
        height={height}
        rx={cornerRadius}
        fill={task.colorHex}
        className="opacity-90"
      />

      {task.isCritical && (
        <rect
          x={-2}
          y={-2}
          width={width + 4}
          height={height + 4}
          rx={cornerRadius + 2}
          stroke="#FCA5A5"
          strokeWidth={2}
          fill="none"
        />
      )}
    </g>
  );
};

export default TaskBar;
