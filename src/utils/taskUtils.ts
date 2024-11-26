import { differenceInDays } from 'date-fns';

/**
 * Calculates the progress percentage based on current date and task/project duration
 *
 * @param startDate - Start date of the task/project
 * @param endDate - End date of the task/project
 * @param currentDate - Current date (defaults to now)
 * @returns Progress percentage between 0-100
 */
export const calculateDateProgress = (
  startDate: Date | string,
  endDate: Date | string,
  currentDate: Date = new Date()
): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // If not started yet
  if (currentDate < start) return 0;
  // If completed
  if (currentDate > end) return 100;

  const totalDuration = differenceInDays(end, start) + 1;
  const daysCompleted = differenceInDays(currentDate, start) + 1;

  return Math.round((daysCompleted / totalDuration) * 100);
};
