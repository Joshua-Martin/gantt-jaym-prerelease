import React, { useMemo } from 'react';
import { useGanttStore } from '../../hooks/useGanttStore';
import { calculateBarPosition } from '../../utils/ganttUtils';
import { ProcessedProject } from '../../types/ganttTypes';
import { StatusIcon } from './StatusIcon';
import { getContrastColor } from '../../utils/colorUtils';

interface ProjectBarProps {
  project: ProcessedProject;
  y: number;
  height: number;
}

export const ProjectBar: React.FC<ProjectBarProps> = ({ project, y, height }) => {
  const { dayWidth, startDate } = useGanttStore();
  const { x, width } = useMemo(
    () => calculateBarPosition(project.startDate, project.endDate, startDate, dayWidth),
    [project.startDate, project.endDate, startDate, dayWidth]
  );
  const cornerRadius = 8;
  const actualBarHeight = height * 0.7;
  const barY = (height - actualBarHeight) / 1.2;
  const contrastColor = getContrastColor(project.colorHex);
  const iconSize = actualBarHeight * 0.6;
  const iconMarginLeft = 12;
  const circleRadius = (iconSize / 2) * 1.4;

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Label */}
      <text x={0} y={barY - 4} className="text-xs font-medium fill-gray-700">
        {project.name}
      </text>

      {/* Background bar with gradient */}
      <defs>
        <linearGradient id={`gradient-${project.id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={project.colorHex} stopOpacity="0.8" />
          <stop offset="100%" stopColor={project.colorHex} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <path
        d={`
          M ${cornerRadius} ${barY}
          H ${width - cornerRadius}
          Q ${width} ${barY} ${width} ${barY + cornerRadius}
          V ${barY + actualBarHeight - cornerRadius}
          Q ${width} ${barY + actualBarHeight} ${width - cornerRadius} ${barY + actualBarHeight}
          H ${cornerRadius}
          Q 0 ${barY + actualBarHeight} 0 ${barY + actualBarHeight - cornerRadius}
          V ${barY + cornerRadius}
          Q 0 ${barY} ${cornerRadius} ${barY}
        `}
        fill={`url(#gradient-${project.id})`}
        className="shadow-sm"
      />

      {/* Progress bar with shimmer effect */}
      <rect
        x={0}
        y={barY}
        width={width * (project.progress / 100)}
        height={actualBarHeight}
        rx={cornerRadius}
        fill={project.colorHex}
        className="opacity-90 animate-shimmer"
      />

      {/* Drag handles with hover effect */}
      <circle
        cx={0}
        cy={barY + actualBarHeight / 2}
        r={4}
        fill="white"
        stroke="#94A3B8"
        strokeWidth={2}
        className="cursor-ew-resize hover:stroke-blue-500 transition-colors"
      />
      <circle
        cx={width}
        cy={barY + actualBarHeight / 2}
        r={4}
        fill="white"
        stroke="#94A3B8"
        strokeWidth={2}
        className="cursor-ew-resize hover:stroke-blue-500 transition-colors"
      />

      {/* Status Icon Group */}
      <g transform={`translate(${iconMarginLeft + circleRadius}, ${barY + actualBarHeight / 2})`}>
        {/* Background circle - now using larger radius */}
        <circle cx={0} cy={0} r={circleRadius} fill={project.colorHex} className="drop-shadow-sm" />

        {/* Status Icon - centered within the larger circle */}
        <g transform={`translate(${-iconSize / 2}, ${-iconSize / 2})`}>
          <StatusIcon status={project.status} color={contrastColor} size={iconSize} />
        </g>
      </g>

      {/* Progress text - adjusted position to account for icon */}
      <text
        x={width - 8}
        y={barY + actualBarHeight / 2}
        dy="0.35em"
        textAnchor="end"
        className="text-xs font-medium"
        fill={contrastColor}
      >
        {`${Math.round(project.progress)}%`}
      </text>
    </g>
  );
};

export default ProjectBar;
