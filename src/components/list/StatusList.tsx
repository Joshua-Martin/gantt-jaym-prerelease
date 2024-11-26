import React from 'react';
import { AlertTriangle, Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { LAYOUT } from '../../utils/ganttUtils';
import type { ProcessedProject, Status } from '../../types/ganttTypes';

interface StatusListProps {
  projects: ProcessedProject[];
}

/**
 * Gets the appropriate status icon component based on the status
 *
 * @param status - The status to get the icon for
 * @returns The icon component and color class
 */
const getStatusIcon = (status: Status): { icon: React.ReactNode; colorClass: string } => {
  switch (status) {
    case 'on-track':
      return {
        icon: <CheckCircle2 className="w-4 h-4" />,
        colorClass: 'text-emerald-500',
      };
    case 'at-risk':
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        colorClass: 'text-amber-500',
      };
    case 'delayed':
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        colorClass: 'text-red-500',
      };
    case 'not-started':
      return {
        icon: <Clock className="w-4 h-4" />,
        colorClass: 'text-gray-400',
      };
    case 'completed':
      return {
        icon: <CheckCircle2 className="w-4 h-4" />,
        colorClass: 'text-blue-500',
      };
    default:
      return {
        icon: <Circle className="w-4 h-4" />,
        colorClass: 'text-gray-400',
      };
  }
};

/**
 * StatusList component displays status icons for projects and tasks
 * Shows critical path indicator and status icons
 */
const StatusList: React.FC<StatusListProps> = ({ projects }) => {
  const headerHeight = LAYOUT.TASK_LIST_HEADER_HEIGHT + 1;

  return (
    <div className="flex-shrink-0 ">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200" style={{ height: headerHeight }} />

      {/* Status Icons */}
      <div className="border-r border-gray-200">
        {projects.map(project => (
          <React.Fragment key={project.id}>
            {/* Project Status */}
            <div
              className="flex items-center justify-center gap-1 px-1 border-b border-l-4 border-gray-200"
              style={{ height: LAYOUT.ROW_HEIGHT.project, borderLeftColor: project.colorHex }}
            >
              {project.isCritical ? (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span className={getStatusIcon(project.status).colorClass}>
                {getStatusIcon(project.status).icon}
              </span>
            </div>

            {/* Task Statuses */}
            {project.tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-center gap-1 px-1 border-b border-l-4 border-gray-200"
                style={{ height: LAYOUT.ROW_HEIGHT.task, borderLeftColor: task.colorHex }}
              >
                {task.isCritical ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <div className="w-4 h-4" />
                )}
                <span className={getStatusIcon(task.status).colorClass}>
                  {getStatusIcon(task.status).icon}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusList;
