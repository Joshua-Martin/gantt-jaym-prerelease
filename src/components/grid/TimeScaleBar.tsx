/**
 * Renders a hierarchical time scale header for the Gantt chart
 *
 * @param {number} width - The total width of the timeline
 * @param {Date} startDate - The start date of the timeline
 * @param {Date} endDate - The end date of the timeline
 */
import React, { useMemo } from 'react';
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  format,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  startOfQuarter,
  addQuarters,
} from 'date-fns';
import { useGanttStore } from '../../hooks/useGanttStore';
import { getXFromDate, TIME_SCALE_CONFIG, LAYOUT } from '../../utils/ganttUtils';

interface TimeScaleProps {
  width: number;
  startDate: Date;
  endDate: Date;
}

const TimeScaleBar: React.FC<TimeScaleProps> = ({ width, startDate, endDate }) => {
  const { dayWidth, timeScale, unitWidth, startOfWeekIndex } = useGanttStore();
  const config = useMemo(() => TIME_SCALE_CONFIG[timeScale], [timeScale]);

  // Memoize header layout calculations
  const layoutConfig = useMemo(() => {
    const needsTwoRows = ['week', 'quarter', 'year'].includes(timeScale);
    const headerHeight = LAYOUT.HEADER_HEIGHT;
    const rowHeight = needsTwoRows ? headerHeight / 2 : headerHeight;
    return { needsTwoRows, headerHeight, rowHeight };
  }, [timeScale]);

  // Get units for the bottom row
  const getBottomRowUnits = () => {
    switch (timeScale) {
      case 'week':
        return eachWeekOfInterval({
          start: startDate,
          end: endDate,
          weekStartsOn: startOfWeekIndex,
        });
      case 'month':
        return eachMonthOfInterval({ start: startDate, end: endDate });
      case 'quarter':
      case 'year': {
        // Always start from January of the start year
        const yearStart = new Date(startDate.getFullYear(), 0, 1);
        const yearEnd = new Date(endDate.getFullYear(), 11, 31);
        return eachMonthOfInterval({
          start: yearStart,
          end: yearEnd,
        });
      }
      default:
        return eachDayOfInterval({ start: startDate, end: endDate });
    }
  };

  // Get units for the top row
  const getTopRowUnits = () => {
    if (!layoutConfig.needsTwoRows) return [];

    switch (timeScale) {
      case 'week':
        return eachMonthOfInterval({ start: startDate, end: endDate });
      case 'quarter':
        // Ensure we get all quarters from the start of the year
        const yearStart = new Date(startDate.getFullYear(), 0, 1);
        const yearEnd = new Date(endDate.getFullYear(), 11, 31);
        return eachQuarterOfInterval({ start: yearStart, end: yearEnd });
      case 'year':
        // Ensure we get all years in the range
        const firstYear = new Date(startDate.getFullYear(), 0, 1);
        const lastYear = new Date(endDate.getFullYear(), 11, 31);
        return eachYearOfInterval({ start: firstYear, end: lastYear });
      default:
        return [];
    }
  };

  const bottomRowUnits = useMemo(
    () => getBottomRowUnits(),
    [startDate, endDate, timeScale, startOfWeekIndex]
  );
  const topRowUnits = useMemo(() => getTopRowUnits(), [startDate, endDate, timeScale]);

  // Memoize unit calculation functions
  const unitCalculators = useMemo(
    () => ({
      getUnitWidth: (date: Date, isTopRow = false) => {
        if (timeScale === 'week' && isTopRow) {
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
          return daysInMonth * dayWidth;
        }

        if (timeScale === 'month') {
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
          return daysInMonth * dayWidth;
        }

        if (timeScale === 'year' && !isTopRow) {
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
          return daysInMonth * dayWidth;
        }

        if (timeScale === 'quarter') {
          const quarterStart = startOfQuarter(date);
          const nextQuarter = addQuarters(quarterStart, 1);
          const daysInQuarter = differenceInDays(nextQuarter, quarterStart);
          return daysInQuarter * dayWidth;
        }

        return unitWidth;
      },
      formatLabel: (date: Date, isTopRow: boolean) => {
        if (!isTopRow) {
          // Bottom row formatting
          switch (timeScale) {
            case 'day':
              return format(date, 'd');
            case 'week': {
              const weekEnd = endOfWeek(date, { weekStartsOn: startOfWeekIndex });
              return `${format(date, 'd')}–${format(weekEnd, 'd')}`;
            }
            case 'month':
              return format(date, 'MMMM yyyy');
            case 'quarter':
            case 'year':
              return format(date, 'MMM');
            default:
              return format(date, config.format);
          }
        } else {
          // Top row formatting (only for scales that need two rows)
          switch (timeScale) {
            case 'week':
              return format(date, 'MMM yyyy');
            case 'quarter':
              return `Q${format(date, 'Q yyyy')}`;
            case 'year':
              return format(date, 'yyyy');
            default:
              return '';
          }
        }
      },
      getXPosition: (date: Date, isTopRow: boolean) => {
        if (timeScale === 'year' && !isTopRow) {
          // For months in year view, calculate position based on days since start of year
          const yearStart = new Date(date.getFullYear(), 0, 1);
          return (
            getXFromDate(yearStart, startDate, dayWidth) +
            differenceInDays(date, yearStart) * dayWidth
          );
        }
        return getXFromDate(date, startDate, dayWidth);
      },
    }),
    [timeScale, dayWidth, unitWidth, startOfWeekIndex]
  );

  // Memoize the rows data
  const rowsData = useMemo(() => {
    const bottomRow = bottomRowUnits.map(date => ({
      key: `bottom-${date.toISOString()}`,
      date,
      x: unitCalculators.getXPosition(date, false),
      width: unitCalculators.getUnitWidth(date, false),
      label: unitCalculators.formatLabel(date, false),
    }));

    const topRow = layoutConfig.needsTwoRows
      ? topRowUnits.map(date => ({
          key: `top-${date.toISOString()}`,
          date,
          x: unitCalculators.getXPosition(date, true),
          width: unitCalculators.getUnitWidth(date, true),
          label: unitCalculators.formatLabel(date, true),
        }))
      : [];

    return { bottomRow, topRow };
  }, [bottomRowUnits, topRowUnits, layoutConfig.needsTwoRows, unitCalculators]);

  // Extract TimeUnit rendering into a memoized component
  const TimeUnit = React.memo(({ unit, isTopRow }: { unit: any; isTopRow: boolean }) => (
    <g key={unit.key}>
      <rect
        x={unit.x}
        y={isTopRow ? 0 : layoutConfig.needsTwoRows ? layoutConfig.rowHeight : 0}
        width={unit.width}
        height={layoutConfig.rowHeight}
        fill="transparent"
        stroke="#E2E8F0"
        strokeWidth={1}
      />
      <text
        x={unit.x + unit.width / 2}
        y={isTopRow ? 15 : layoutConfig.needsTwoRows ? 37 : 26}
        textAnchor="middle"
        className="text-xs font-medium fill-gray-600"
      >
        {unit.label}
      </text>
    </g>
  ));

  return (
    <div className="overflow-hidden bg-[#F8FAFC] border-b border-gray-200" style={{ width }}>
      <svg width={width} height={layoutConfig.headerHeight}>
        <rect x={0} y={0} width={width} height={layoutConfig.headerHeight} fill="#F8FAFC" />

        {layoutConfig.needsTwoRows &&
          rowsData.topRow.map(unit => <TimeUnit key={unit.key} unit={unit} isTopRow={true} />)}

        {rowsData.bottomRow.map(unit => (
          <TimeUnit key={unit.key} unit={unit} isTopRow={false} />
        ))}
      </svg>
    </div>
  );
};

export default TimeScaleBar;
