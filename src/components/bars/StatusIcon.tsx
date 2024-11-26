/**
 * Component that renders different status icons for Gantt chart items
 *
 * @param {Object} props - Component props
 * @param {Status} props.status - Current status of the item
 * @param {string} props.color - Color to use for the icon
 * @param {number} props.size - Size of the icon in pixels
 */
import React from 'react';
import { Status } from '../../types/ganttTypes';

interface StatusIconProps {
  status: Status;
  color: string;
  size?: number;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status, color, size = 16 }) => {
  const getStatusPath = (): string => {
    switch (status) {
      case 'on-track':
        return 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2-10l2 2 4-4';
      case 'at-risk':
        return 'M12 8v5m0 2h.01M12 2L2 19h20L12 2z';
      case 'delayed':
        return 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-14v5l4 4';
      case 'completed':
        return 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2-10l2 2 4-4';
      case 'not-started':
        return 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 12h.01M12 12h.01M16 12h.01';
      default:
        return '';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={getStatusPath()} />
    </svg>
  );
};
