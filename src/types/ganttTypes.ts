/**
 * Represents the status of a task or project
 */
export type Status = 'on-track' | 'at-risk' | 'delayed' | 'completed' | 'not-started';

/**
 * Represents the type of a task or project item
 */
export type ItemType = 'task' | 'task-milestone' | 'project' | 'prime-milestone';

/**
 * Represents a task within a project
 */
// Input interfaces (raw data)
export interface InputTask {
  id: string;
  name: string;
  status: Status;
  startDate: string;
  endDate: string;
  duration: number;
  type: 'task' | 'task-milestone';
  isCritical: boolean;
  dependencies: string[];
  subcontractor?: string;
  progress?: number; // Optional in input
}

export interface InputProject {
  id: string;
  name: string;
  status: Status;
  startDate: string;
  duration: number;
  type: 'project' | 'prime-milestone';
  endDate: string;
  expanded: boolean;
  isCritical: boolean;
  tasks: InputTask[];
  progress?: number; // Optional in input
}

export interface InputGanttData {
  projects: InputProject[];
}

// Processed interfaces (after store enrichment)
export interface ProcessedTask extends Omit<InputTask, 'progress'> {
  progress: number;
  colorHex: string;
}

export interface ProcessedProject extends Omit<InputProject, 'progress' | 'tasks'> {
  progress: number;
  tasks: ProcessedTask[];
  colorGroup: string;
  colorHex: string;
}

export interface ProcessedGanttData {
  projects: ProcessedProject[];
}

export interface GridDimensions {
  width: number;
  height: number;
  dayWidth: number;
  totalDays: number;
}

/**
 * Represents the available time scale options for the Gantt chart
 */
export type TimeScale = 'day' | 'week' | 'month' | 'quarter' | 'year';

/**
 * Represents the column ids for the Gantt chart
 */
export type ColumnId = 'name' | 'startDate' | 'endDate' | 'progress';

/**
 * Configuration for each time scale option
 */
export interface TimeScaleConfig {
  minUnitWidth: number;
  daysPerUnit: number | ((date: Date) => number); // Allow dynamic days calculation
  format: string;
  dayUnitMin?: number;
}

// Add these new types
export interface GanttColumn {
  id: ColumnId;
  label: string;
  always?: boolean;
}

export const GANTT_COLUMNS = [
  { id: 'name' as const, label: 'Name', always: true },
  { id: 'startDate' as const, label: 'Start Date' },
  { id: 'endDate' as const, label: 'End Date' },
  { id: 'progress' as const, label: 'Progress' },
] as const;

export type GanttColumns = typeof GANTT_COLUMNS;
