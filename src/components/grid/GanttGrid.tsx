// GanttGrid.tsx
import React, { useEffect, useMemo } from 'react';
import { differenceInDays, eachDayOfInterval } from 'date-fns';
import { useGanttStore } from '../../hooks/useGanttStore';
import { getGridIntervalDates, getGridLineStyle, getXFromDate } from '../../utils/ganttUtils';

interface GanttGridProps {
  width: number;
  height: number;
  startDate: Date;
  endDate: Date;
}

/**
 * GanttGrid Component
 * Renders the grid system for the Gantt chart, including weekend highlighting,
 * vertical time-based grid lines, and horizontal row separators.
 *
 * @param {number} width - The visible width of the grid (viewport width)
 * @param {number} height - The total height of the grid
 * @param {Date} startDate - The start date of the chart
 * @param {Date} endDate - The end date of the chart
 * @param {number} rowHeight - Height of each row in the grid
 */
const GanttGrid: React.FC<GanttGridProps> = ({ width, height, startDate, endDate }) => {
  const { dayWidth, timeScale, startOfWeekIndex, setGridWidth, data, rowPositions, gridWidth } =
    useGanttStore();

  // Memoize the total width calculation
  const totalWidth = useMemo(() => {
    const daysInChart = differenceInDays(endDate, startDate) + 1;
    return daysInChart * dayWidth;
  }, [dayWidth, startDate, endDate]);

  // Update grid width when total width changes
  useEffect(() => {
    setGridWidth(totalWidth);
  }, [totalWidth, setGridWidth]);

  // Memoize all days calculation
  const allDays = useMemo(
    () => eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  // Memoize grid lines calculation
  const gridLines = useMemo(
    () => getGridIntervalDates(timeScale, dayWidth, startDate, endDate, startOfWeekIndex),
    [timeScale, dayWidth, startDate, endDate, startOfWeekIndex]
  );

  // Memoize the weekend background rectangles
  const weekendRects = useMemo(
    () =>
      allDays.map((day, i) => {
        const x = i * dayWidth;
        const isWeekend = [0, 6].includes(day.getDay());

        return (
          <rect
            key={day.toISOString()}
            x={x}
            y={0}
            width={dayWidth}
            height={height}
            fill={isWeekend ? '#F8FAFC' : 'transparent'}
            className="transition-colors"
          />
        );
      }),
    [allDays, dayWidth, height]
  );

  // Memoize the grid lines
  const gridLineElements = useMemo(
    () =>
      gridLines.map(date => {
        const x = getXFromDate(date, startDate, dayWidth);
        const { stroke, strokeWidth } = getGridLineStyle(
          date,
          timeScale,
          dayWidth,
          startOfWeekIndex
        );

        return (
          <line
            key={`grid-${date.toISOString()}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      }),
    [gridLines, startDate, dayWidth, timeScale, startOfWeekIndex, height]
  );

  useEffect(() => {
    console.log('totalWidth', totalWidth);
    console.log('width', width);
  }, [totalWidth, width]);

  // Memoize the horizontal row lines
  const rowLines = useMemo(() => {
    if (!data) return [];
    return Array.from(rowPositions.entries()).map(([id, y]) => (
      <line key={id} x1={0} y1={y} x2={gridWidth} y2={y} stroke="#F1F5F9" strokeWidth={1} />
    ));
  }, [data, rowPositions, gridWidth]);

  return (
    <g className="gantt-grid">
      {weekendRects}
      {gridLineElements}
      {rowLines}
    </g>
  );
};

export default React.memo(GanttGrid);
