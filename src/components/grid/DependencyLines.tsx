import React, { useMemo } from 'react';
import { useGanttStore } from '../../hooks/useGanttStore';
import { calculateBarPosition, LAYOUT } from '../../utils/ganttUtils';
import type { ProcessedProject, ProcessedTask } from '../../types/ganttTypes';

interface Point {
  x: number;
  y: number;
}

/**
 * DependencyLines Component
 * Renders SVG lines and arrows representing task dependencies in the Gantt chart.
 * Uses Finish-to-Start (FS) dependency principle where a dependent task cannot
 * start until its predecessor task finishes.
 */
const DependencyLines: React.FC = () => {
  const { data, dayWidth, startDate } = useGanttStore();

  // Create a map of all tasks for quick lookup
  const taskMap = useMemo(() => {
    const map = new Map<
      string,
      { task: ProcessedTask; project: ProcessedProject; yPosition: number }
    >();

    let currentY = 0;

    data?.projects.forEach(project => {
      // Add project height
      currentY += LAYOUT.ROW_HEIGHT.project;

      project.tasks.forEach(task => {
        map.set(task.id, {
          task,
          project,
          yPosition: currentY + LAYOUT.ROW_HEIGHT.task / 2,
        });
        currentY += LAYOUT.ROW_HEIGHT.task;
      });
    });

    return map;
  }, [data]);

  // Calculate dependency lines
  const dependencyPaths = useMemo(() => {
    const paths: { path: string; color: string }[] = [];
    const arrowOffset = 8; // Horizontal space for the arrow
    const taskBarHeight = 24; // Height of the task bar
    const verticalOffset = taskBarHeight / 2; // Half the height of the task bar

    taskMap.forEach(({ task: dependentTask, yPosition: dependentY }) => {
      dependentTask.dependencies.forEach(dependencyId => {
        const dependency = taskMap.get(dependencyId);
        if (!dependency) return;

        // Calculate start point (end of dependency task)
        const dependencyEnd = calculateBarPosition(
          dependency.task.startDate,
          dependency.task.endDate,
          startDate,
          dayWidth
        );

        // Start slightly before the end of the dependency task and offset vertically
        const startPoint: Point = {
          x: dependencyEnd.x + dependencyEnd.width - arrowOffset,
          y: dependency.yPosition + verticalOffset, // Add vertical offset
        };

        // Calculate end point (start of dependent task)
        const dependentStart = calculateBarPosition(
          dependentTask.startDate,
          dependentTask.endDate,
          startDate,
          dayWidth
        );
        const endPoint: Point = {
          x: dependentStart.x + arrowOffset,
          y: dependentY,
        };

        const path = generateDependencyPath(startPoint, endPoint);

        paths.push({
          path,
          color: '#41403f',
        });
      });
    });

    return paths;
  }, [taskMap, dayWidth, startDate]);

  if (!data) return null;

  return (
    <g className="dependency-lines">
      {dependencyPaths.map((dependency, index) => (
        <path
          key={index}
          d={dependency.path}
          fill="none"
          stroke={dependency.color}
          strokeWidth={1.5}
          markerEnd="url(#arrowhead)"
          className="opacity-100 hover:opacity-100 transition-opacity"
        />
      ))}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" className="transition-colors" />
        </marker>
      </defs>
    </g>
  );
};

/**
 * Generates an SVG path string for a dependency line
 * Creates a path that moves vertically first, then horizontally
 * Uses straight lines with right angles instead of curves
 */
const generateDependencyPath = (start: Point, end: Point): string => {
  // First move vertically, then horizontally
  return `
    M ${start.x},${start.y}
    V ${end.y}
    H ${end.x}
  `.trim();
};

export default React.memo(DependencyLines);
