// GanttChart.tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import GanttGrid from '../grid/GanttGrid';
import { ProjectBar } from '../bars/ProjectBar';
import { TaskBar } from '../bars/TaskBar';
import TimeScaleBar from '../grid/TimeScaleBar';
import { useGanttStore } from '../../hooks/useGanttStore';
import { calculateChartEndDate, calculateChartStartDate, LAYOUT } from '../../utils/ganttUtils';
import type { TimeScale, ColumnId } from '../../types/ganttTypes';
import { Day } from 'date-fns';
import TaskList from '../list/TaskList';
import MilestoneBar from '../bars/MilestoneBar';
import TodayMarker from '../grid/TodayMarker';
import StatusList from '../list/StatusList';
import DependencyLines from '../grid/DependencyLines';

/**
 * SvgGantt is a React component that renders a Gantt chart using SVG.
 * It supports projects, tasks, milestones, and dependencies visualization.
 *
 * @component
 * @example
 * ```tsx
 * <SvgGantt />
 * ```
 */
export const SvgGantt: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref for GanttChart container
  const timelineRef = useRef<HTMLDivElement>(null);
  // Ref for TimeScaleBar (header)
  const headerRef = useRef<HTMLDivElement>(null);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const timeScale = useGanttStore(state => state.timeScale);
  const startOfWeekIndex = useGanttStore(state => state.startOfWeekIndex);
  const gridWidth = useGanttStore(state => state.gridWidth);
  const data = useGanttStore(state => state.data);
  const setStartOfWeek = useGanttStore(state => state.setStartOfWeek);
  const setDimensions = useGanttStore(state => state.setDimensions);
  const timeScaleOptions: TimeScale[] = ['day', 'week', 'month', 'quarter', 'year'];

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft } = event.currentTarget;

    if (event.currentTarget === headerRef.current && timelineRef.current) {
      timelineRef.current.scrollLeft = scrollLeft;
    } else if (event.currentTarget === timelineRef.current && headerRef.current) {
      headerRef.current.scrollLeft = scrollLeft;
    }
  };

  // Calculate dates once
  const rawStartDate = new Date(
    Math.min(...(data?.projects.map(p => new Date(p.startDate).getTime()) ?? []))
  );
  const memoizedStartDate = useMemo(
    // calculate chart start date based on the first project start date and the time scale
    // time scale is stored in the gantt store
    // when the time scale is changed, the memoized start date is recalculated
    () => calculateChartStartDate(rawStartDate, timeScale),
    [rawStartDate, timeScale]
  );
  const memoizedEndDate = useMemo(
    () => calculateChartEndDate(data?.projects ?? [], timeScale),
    [data?.projects, timeScale]
  );

  // Watch for resize and timeScale changes
  useEffect(() => {
    if (timelineRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        const newWidth = entry.contentRect.width;

        setDimensions(newWidth, memoizedStartDate, memoizedEndDate);
        +setTimelineWidth(newWidth); // Add this line
      });

      // Initial width set
      if (timelineRef.current) {
        const initialWidth = timelineRef.current.clientWidth;
        setDimensions(initialWidth, memoizedStartDate, memoizedEndDate);
        +setTimelineWidth(initialWidth); // Add this line
      }

      resizeObserver.observe(timelineRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [timeScale, setDimensions, rawStartDate, memoizedEndDate]);

  // Calculate total height for the timeline
  const getTotalHeight = () => {
    return (data?.projects ?? []).reduce((total, project) => {
      return total + LAYOUT.ROW_HEIGHT.project + project.tasks.length * LAYOUT.ROW_HEIGHT.task;
    }, 0);
  };

  // handler for hiding columns, updates the gantt store
  // either turns a column on or off (add it to the array or remove it)
  const toggleColumn = (columnId: ColumnId) => {
    useGanttStore.getState().toggleColumn(columnId);
  };

  const memoizedTotalHeight = useMemo(() => getTotalHeight(), [data?.projects]);

  const startOfWeekOptions = [
    { label: 'Sunday', value: 0 as Day },
    { label: 'Monday', value: 1 as Day },
  ];

  const taskListWidth = LAYOUT.TASK_PANE_WIDTH;

  if (!data) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Time scale controls */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex flex-col p-2">
          <span className="text-xs text-white mb-1">Time Scale:</span>
          <div className="flex space-x-2">
            {timeScaleOptions.map(scale => (
              <button
                key={scale}
                onClick={() => useGanttStore.getState().setTimeScale(scale)}
                className={`px-3 py-1 rounded-md text-xs ${
                  useGanttStore.getState().timeScale === scale
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-200 hover:bg-gray-100'
                }`}
              >
                {scale.charAt(0).toUpperCase() + scale.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-2">
          <span className="text-xs text-white mb-1">Start of Week:</span>
          <div className="flex space-x-2">
            {startOfWeekOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setStartOfWeek(option.value)}
                className={`px-3 py-1 rounded-md text-xs ${
                  startOfWeekIndex === option.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-200 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-2">
          <span className="text-xs text-white mb-1">Toggle:</span>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded-md text-xs ${
                useGanttStore.getState().visibleColumns.has('name')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => toggleColumn('name')}
            >
              Name
            </button>
            <button
              className={`px-3 py-1 rounded-md text-xs ${
                useGanttStore.getState().visibleColumns.has('startDate')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => toggleColumn('startDate')}
            >
              Start
            </button>
            <button
              className={`px-3 py-1 rounded-md text-xs ${
                useGanttStore.getState().visibleColumns.has('endDate')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => toggleColumn('endDate')}
            >
              End
            </button>
            <button
              className={`px-3 py-1 rounded-md text-xs ${
                useGanttStore.getState().visibleColumns.has('progress')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => toggleColumn('progress')}
            >
              Progress
            </button>
          </div>
        </div>
      </div>

      {/* Main Gantt container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-white rounded-xl shadow-xl border border-gray-100 pb-4 overflow-hidden"
      >
        <div className="flex">
          <StatusList projects={data?.projects ?? []} />
          {/* Left side - TaskList */}
          <div className="overflow-Y-auto" style={{ width: taskListWidth }}>
            <TaskList projects={data?.projects ?? []} />
          </div>

          <div className="flex flex-col flex-grow overflow-hidden">
            <div
              ref={headerRef}
              onScroll={handleScroll}
              className="sticky top-0 bg-white z-10 overflow-x-auto"
            >
              <TimeScaleBar
                width={gridWidth}
                startDate={memoizedStartDate}
                endDate={memoizedEndDate}
              />
            </div>
            {/* Right side - Timeline */}
            <div
              ref={timelineRef}
              className="flex-grow overflow-x-auto overflow-y-auto scrollbar-hide"
            >
              {/* TimeScale */}

              {/* SVG Grid and Bars */}
              <div style={{ width: gridWidth, position: 'relative' }}>
                <svg width={gridWidth} height={memoizedTotalHeight}>
                  {/* Gradients definitions */}
                  <defs>
                    {['on-track', 'at-risk', 'delayed', 'completed'].map(status => (
                      <linearGradient
                        key={status}
                        id={`${status}-gradient`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop
                          offset="0%"
                          stopColor={
                            status === 'on-track'
                              ? '#10B981'
                              : status === 'at-risk'
                                ? '#F59E0B'
                                : status === 'delayed'
                                  ? '#EF4444'
                                  : '#60A5FA'
                          }
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            status === 'on-track'
                              ? '#059669'
                              : status === 'at-risk'
                                ? '#D97706'
                                : status === 'delayed'
                                  ? '#DC2626'
                                  : '#3B82F6'
                          }
                        />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Grid */}
                  {timelineWidth > 0 && (
                    <GanttGrid
                      width={timelineWidth}
                      height={memoizedTotalHeight}
                      startDate={memoizedStartDate}
                      endDate={memoizedEndDate}
                    />
                  )}
                  <TodayMarker height={memoizedTotalHeight} />
                  {/* Projects and Tasks */}
                  {(data?.projects ?? []).map((project, projectIndex) => {
                    // Calculate the y-position based on all previous projects
                    const previousProjectsHeight = (data?.projects ?? [])
                      .slice(0, projectIndex)
                      .reduce(
                        (total, prev) =>
                          total +
                          LAYOUT.ROW_HEIGHT.project +
                          prev.tasks.length * LAYOUT.ROW_HEIGHT.task,
                        0
                      );

                    return (
                      <g key={project.id}>
                        {/* Render project bar or milestone */}
                        {project.type === 'prime-milestone' ? (
                          <MilestoneBar
                            item={project}
                            y={previousProjectsHeight + (LAYOUT.ROW_HEIGHT.project - 32) / 2}
                            size={32}
                          />
                        ) : (
                          <ProjectBar
                            project={project}
                            y={previousProjectsHeight + (LAYOUT.ROW_HEIGHT.project - 32) / 2}
                            height={32}
                          />
                        )}

                        {/* Task bars and milestones */}
                        {project.tasks.map((task, taskIndex) => {
                          const taskY =
                            previousProjectsHeight +
                            LAYOUT.ROW_HEIGHT.project +
                            taskIndex * LAYOUT.ROW_HEIGHT.task;

                          return task.type === 'task-milestone' ? (
                            <MilestoneBar
                              key={task.id}
                              item={task}
                              y={taskY + (LAYOUT.ROW_HEIGHT.task - 24) / 2}
                              size={24}
                            />
                          ) : (
                            <TaskBar
                              key={task.id}
                              task={task}
                              y={taskY + (LAYOUT.ROW_HEIGHT.task - 24) / 2}
                              height={24}
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                  <DependencyLines />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SvgGantt;
