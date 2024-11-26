import {
  differenceInDays,
  eachMonthOfInterval,
  eachDayOfInterval,
  eachWeekOfInterval,
  getDaysInMonth,
  getDaysInYear,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  startOfDay,
  previousSunday,
  subDays,
  Day,
} from 'date-fns';
import { ProcessedProject, TimeScaleConfig } from '../types/ganttTypes';
import { TimeScale } from '../types/ganttTypes';

export interface DatePosition {
  x: number;
  width: number;
}

export const calculateBarPosition = (
  startDate: Date | string,
  endDate: Date | string,
  chartStartDate: Date,
  dayWidth: number
): DatePosition => {
  // Parse dates using Date constructor directly
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // Ensure we're working with the start of each day
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  chartStartDate.setHours(0, 0, 0, 0);

  const daysFromStart = differenceInDays(start, chartStartDate) + 1;
  const duration = differenceInDays(end, start) + 1;

  return {
    x: daysFromStart * dayWidth,
    width: duration * dayWidth,
  };
};

export const getXFromDate = (date: Date, chartStartDate: Date, dayWidth: number): number => {
  const daysFromStart = differenceInDays(date, chartStartDate);
  const x = daysFromStart * dayWidth;
  return x;
};

// Constants for layout
export const LAYOUT = {
  TASK_PANE_WIDTH: 420, // w-96
  HEADER_HEIGHT: 44,
  TASK_LIST_HEADER_HEIGHT: 56, // Compensate for Scrollbar
  ROW_HEIGHT: {
    project: 48, // h-14
    task: 36, // h-12
  },
  COLUMN_WIDTH: {
    name: 200,
    startDate: 80,
    endDate: 80,
    progress: 60,
  },
};

// Date formatting utilities
export const formatMonth = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Grid calculations
export const calculateGridDimensions = (width: number, startDate: Date, endDate: Date) => {
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const dayWidth = width / totalDays;
  return { totalDays, dayWidth };
};

/**
 * Configuration for different time scales
 */
export const TIME_SCALE_CONFIG: Record<TimeScale, TimeScaleConfig> = {
  day: {
    minUnitWidth: 40, // 30 px per day
    daysPerUnit: 1,
    format: 'd',
  },
  week: {
    minUnitWidth: 175, // 140 px per week / 20 px per day
    daysPerUnit: 7,
    format: 'MMM d',
    dayUnitMin: 20,
  },
  month: {
    minUnitWidth: 280, // 280 px per month / 10 px per day
    daysPerUnit: (date: Date) => getDaysInMonth(date),
    format: 'MMMM yyyy',
    dayUnitMin: 30,
  },
  quarter: {
    minUnitWidth: 455, // 455 px per quarter / 10 px per day
    daysPerUnit: (date: Date) => {
      // Sum the days in each month of the quarter
      return [0, 1, 2].reduce((sum, monthOffset) => {
        const monthDate = new Date(date.getFullYear(), date.getMonth() + monthOffset);
        return sum + getDaysInMonth(monthDate);
      }, 0);
    },
    format: 'QQQ yyyy',
    dayUnitMin: 30,
  },
  year: {
    minUnitWidth: 455,
    daysPerUnit: (date: Date) => getDaysInYear(date),
    format: 'yyyy',
    dayUnitMin: 30,
  },
};

/**
 * Gets the start date for a given time scale
 */
export const getTimeScaleStart = (date: Date, scale: TimeScale, startOfWeekIndex: Day): Date => {
  switch (scale) {
    case 'day':
      return date;
    case 'week':
      return startOfWeek(date, { weekStartsOn: startOfWeekIndex });
    case 'month':
      return startOfMonth(date);
    case 'quarter':
      return startOfQuarter(date);
    case 'year':
      return startOfYear(date);
  }
};

/**
 * Calculates the effective start date for the chart based on the first project start date
 * and the selected time scale
 *
 * @param firstStartDate - The earliest start date from the project data
 * @param timeScale - The current time scale (day, week, month, etc.)
 * @returns The calculated chart start date
 */
export const calculateChartStartDate = (firstStartDate: Date, timeScale: TimeScale): Date => {
  switch (timeScale) {
    case 'day':
      return startOfDay(subDays(firstStartDate, 1));
    case 'week':
      return previousSunday(firstStartDate);
    case 'month':
      return startOfMonth(firstStartDate);
    case 'quarter':
      return startOfQuarter(firstStartDate);
    case 'year':
      return startOfYear(firstStartDate);
    default:
      return startOfDay(firstStartDate);
  }
};

/**
 * Calculates the end date for the chart based on project data and extends it by a duration
 * that varies based on the selected time scale
 *
 * @param projects - Array of projects
 * @param timeScale - The current time scale (day, week, month, quarter, year)
 * @returns The calculated end date with scale-based extension
 */
export const calculateChartEndDate = (projects: ProcessedProject[], timeScale: TimeScale): Date => {
  // Find the latest end date from all projects and tasks
  const lastEndDate = Math.max(
    ...projects.flatMap(p => [
      new Date(p.endDate).getTime(),
      ...p.tasks.map(t => new Date(t.endDate).getTime()),
    ])
  );

  // Create a new date from the latest end date
  const baseEndDate = new Date(lastEndDate);

  // Add extension based on time scale
  switch (timeScale) {
    case 'day':
      return new Date(baseEndDate.setDate(baseEndDate.getDate() + 7)); // Add a week
    case 'week':
      return new Date(baseEndDate.setMonth(baseEndDate.getMonth() + 1)); // Add a month
    case 'month':
      return new Date(baseEndDate.setMonth(baseEndDate.getMonth() + 1)); // Add a month
    case 'quarter':
      return new Date(baseEndDate.setMonth(baseEndDate.getMonth() + 3)); // Add a quarter
    case 'year':
      return new Date(baseEndDate.setFullYear(baseEndDate.getFullYear() + 1)); // Add a year
    default:
      return baseEndDate;
  }
};

/**
 * Calculates the unit width based on the time scale and available space
 */
export const calculateUnitWidth = (
  timeScale: TimeScale,
  gridWidth: number,
  daysInChart: number,
  startDate: Date
): number => {
  const config = TIME_SCALE_CONFIG[timeScale];
  const daysPerUnit =
    typeof config.daysPerUnit === 'function' ? config.daysPerUnit(startDate) : config.daysPerUnit;

  // If the total chart duration is less than one unit, return the grid width
  if (daysInChart < daysPerUnit) {
    return gridWidth;
  }

  // Calculate the width based on the number of units that will fit
  const numberOfUnits = Math.ceil(daysInChart / daysPerUnit);
  const calculatedWidth = gridWidth / numberOfUnits;

  // Return the larger of the minimum width or calculated width
  return Math.max(config.minUnitWidth, calculatedWidth);
};

/**
 * Calculates the day width based on the unit width and days per unit
 */
export const calculateDayWidth = (
  timeScale: TimeScale,
  unitWidth: number,
  startDate: Date
): number => {
  const config = TIME_SCALE_CONFIG[timeScale];
  const daysPerUnit =
    typeof config.daysPerUnit === 'function' ? config.daysPerUnit(startDate) : config.daysPerUnit;

  return unitWidth / daysPerUnit;
};

/**
 * Determines the grid line interval based on time scale and day width
 * @param timeScale - The current time scale
 * @param dayWidth - The calculated width per day
 * @param startDate - The start date of the chart
 * @returns Array of dates representing grid lines
 */
export const getGridIntervalDates = (
  timeScale: TimeScale,
  dayWidth: number,
  startDate: Date,
  endDate: Date,
  startOfWeekIndex: Day
): Date[] => {
  const config = TIME_SCALE_CONFIG[timeScale];
  const { dayUnitMin = 0 } = config;

  // For day scale, always return daily intervals
  if (timeScale === 'day') {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }

  // For other scales, check if we should use a larger interval
  if (dayWidth < dayUnitMin) {
    switch (timeScale) {
      case 'week':
        return eachWeekOfInterval({
          start: startDate,
          end: endDate,
          weekStartsOn: startOfWeekIndex,
        });
      case 'month':
        return eachWeekOfInterval({
          start: startDate,
          end: endDate,
          weekStartsOn: startOfWeekIndex,
        });
      case 'quarter':
      case 'year':
        return eachMonthOfInterval({ start: startDate, end: endDate });
    }
  }

  // Default to daily intervals
  return eachDayOfInterval({ start: startDate, end: endDate });
};

/**
 * Gets the grid line style based on the date and interval type
 * @param date - The date to check
 * @param timeScale - The current time scale
 * @param dayWidth - The calculated width per day
 * @returns Object containing stroke color and width
 */
export const getGridLineStyle = (
  date: Date,
  timeScale: TimeScale,
  dayWidth: number,
  startOfWeekIndex: Day
): { stroke: string; strokeWidth: number } => {
  const config = TIME_SCALE_CONFIG[timeScale];
  const { dayUnitMin = 0 } = config;
  const isReducedInterval = dayWidth < dayUnitMin;

  // Major grid lines for larger intervals
  if (isReducedInterval) {
    switch (timeScale) {
      case 'week':
      case 'month':
        if (date.getDay() === startOfWeekIndex) return { stroke: '#CBD5E1', strokeWidth: 1.5 };
        break;
      case 'quarter':
      case 'year':
        if (date.getDate() === 1) return { stroke: '#CBD5E1', strokeWidth: 1.5 }; // First of month
        break;
    }
  }

  // Default grid line style
  return { stroke: '#E2E8F0', strokeWidth: 1 };
};

/**
 * calculateToday location
 * Calculates the location on the gantt chart for todays date.
 */
export const calculateTodayLocation = (startDate: Date, dayWidth: number): number => {
  const today = new Date();
  // Difference in days, does not count start and end dates (add 2 to include start and end dates)
  // We will add 1 day, since we will be adding half a day width to the x position
  const daysFromStart = differenceInDays(today, startDate);
  // use half day width for today, to show marker in middle of day
  const x = daysFromStart * dayWidth + dayWidth / 2;
  return x;
};
