import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { LAYOUT } from '../../utils/ganttUtils';
import type { ProcessedProject } from '../../types/ganttTypes';
import { format } from 'date-fns';
import { useGanttStore } from '../../hooks/useGanttStore';
import { GANTT_COLUMNS } from '../../types/ganttTypes';

/**
 * Formats a date string into a readable string (e.g., "Mar 15, 2024")
 *
 * @param {string} dateStr - The date string to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'MMM d, yyyy');
};

/**
 * TaskList component displays the left panel of the Gantt chart as a table with project and task details
 *
 * @param {Object} props - Component props
 * @param {ProcessedProject[]} props.projects - Array of project data to display
 *
 * @returns {React.ReactElement} The rendered TaskList component
 */
interface TaskListProps {
  projects: ProcessedProject[];
}

const TaskList: React.FC<TaskListProps> = ({ projects }) => {
  const visibleColumns = useGanttStore(state => state.visibleColumns);
  const headerHeight = LAYOUT.TASK_LIST_HEADER_HEIGHT;

  const taskListWidth = useMemo(() => {
    return GANTT_COLUMNS.reduce((acc, column) => {
      return acc + (visibleColumns.has(column.id) ? LAYOUT.COLUMN_WIDTH[column.id] : 0);
    }, 0);
  }, [visibleColumns]);

  return (
    <div
      className="flex-shrink-0 border-r border-gray-200 bg-white"
      style={{ width: taskListWidth }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200" style={{ height: headerHeight }}>
            {GANTT_COLUMNS.map(
              column =>
                visibleColumns.has(column.id) && (
                  <th
                    key={column.id}
                    className="text-left px-1 py-2 text-xs font-medium text-gray-600"
                    style={{ paddingLeft: column.id === 'name' ? '0.75rem' : '0.25rem' }}
                  >
                    {column.label}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <React.Fragment key={project.id}>
              <tr className="hover:bg-gray-50 border-b border-gray-100">
                <td className="px-1" style={{ height: LAYOUT.ROW_HEIGHT.project }}>
                  <div className="flex items-center gap-1">
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                      <div className="text-xs text-gray-500">{project.tasks.length} tasks</div>
                    </div>
                  </div>
                </td>
                {visibleColumns.has('startDate') && (
                  <td className="px-1 text-xs text-gray-600">{formatDate(project.startDate)}</td>
                )}
                {visibleColumns.has('endDate') && (
                  <td className="px-1 text-xs text-gray-600">{formatDate(project.endDate)}</td>
                )}
                {visibleColumns.has('progress') && (
                  <td className="px-1 pr-2 text-xs text-gray-600 text-right">
                    {project.progress}%
                  </td>
                )}
              </tr>
              {project.tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-2" style={{ height: LAYOUT.ROW_HEIGHT.task }}>
                    <span className="text-xs text-gray-600">{task.name}</span>
                  </td>
                  {visibleColumns.has('startDate') && (
                    <td className="px-1 text-xs text-gray-600">{formatDate(task.startDate)}</td>
                  )}
                  {visibleColumns.has('endDate') && (
                    <td className="px-1 text-xs text-gray-600">{formatDate(task.endDate)}</td>
                  )}
                  {visibleColumns.has('progress') && (
                    <td className="px-1 pr-2 text-xs text-gray-600 text-right">{task.progress}%</td>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
