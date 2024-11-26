import { Day, differenceInDays } from 'date-fns';
import { calculateChartStartDate, calculateDayWidth } from '../utils/ganttUtils';
import { InputGanttData, ProcessedGanttData, TimeScale, ColumnId } from '../types/ganttTypes';
import { calculateUnitWidth } from '../utils/ganttUtils';
import { create } from 'zustand';
import { calculateDateProgress } from '../utils/taskUtils';
import colorConfig from '../components/colors/colorConfig';

interface GanttState {
  width: number;
  startDate: Date;
  endDate: Date;
  dayWidth: number;
  unitWidth: number;
  timeScale: TimeScale;
  startOfWeekIndex: Day;
  gridWidth: number;
  totalHeight: number;
  rowPositions: Map<string, number>; // Store Y positions for projects and tasks
  data: ProcessedGanttData | null;
  progressMap: Map<string, number>; // Add this new property
  visibleColumns: Set<ColumnId>;

  // Actions
  setTimeScale: (scale: TimeScale) => void;
  setDimensions: (width: number, startDate: Date, endDate: Date) => void;
  setStartOfWeek: (startOfWeekIndex: Day) => void;
  setGridWidth: (gridWidth: number) => void;
  setData: (data: InputGanttData) => void;
  getRowPosition: (id: string) => number;
  toggleColumn: (columnId: ColumnId) => void;
  setVisibleColumns: (columns: ColumnId[]) => void;
}

const assignColors = (data: InputGanttData): ProcessedGanttData => {
  const colorGroups = colorConfig.groups;

  return {
    projects: data.projects.map((project, projectIndex) => {
      // Validate project dates
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      if (projectEnd < projectStart) {
        console.warn(`Project ${project.id} has end date before start date. Adjusting end date.`);
        project.endDate = project.startDate; // Set end date equal to start date
      }

      // Assign color group to project (cycling through available groups)
      const groupIndex = projectIndex % colorGroups.length;
      const colorGroup = colorGroups[groupIndex];

      // Use the darkest variation (order: 1) for the project
      const projectColor =
        colorGroup.variations.find(v => v.order === 1)?.hex || colorGroup.baseColor;

      // Process tasks with incrementing color variations
      const tasks = project.tasks.map((task, taskIndex) => {
        // Validate task dates
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        if (taskEnd < taskStart) {
          console.warn(`Task ${task.id} has end date before start date. Adjusting end date.`);
          task.endDate = task.startDate; // Set end date equal to start date
        }

        // Start from order 2 for tasks, cycle back to 2 after reaching end
        const variationOrder = (taskIndex % 7) + 2; // 7 variations available (2-8)
        const taskColor =
          colorGroup.variations.find(v => v.order === variationOrder)?.hex || colorGroup.baseColor;

        return {
          ...task,
          progress: task.progress ?? calculateDateProgress(task.startDate, task.endDate),
          colorHex: taskColor,
        };
      });

      return {
        ...project,
        progress: project.progress ?? calculateDateProgress(project.startDate, project.endDate),
        tasks,
        colorGroup: colorGroup.name,
        colorHex: projectColor,
      };
    }),
  };
};

export const useGanttStore = create<GanttState>((set, get) => ({
  width: 0,
  startDate: new Date(),
  endDate: new Date(),
  dayWidth: 0,
  unitWidth: 0,
  timeScale: 'week',
  startOfWeekIndex: 0,
  gridWidth: 0,
  totalHeight: 0,
  rowPositions: new Map(),
  data: null,
  progressMap: new Map(),
  visibleColumns: new Set(['name', 'startDate', 'endDate', 'progress']), // default visible columns

  // Calculate row positions and total height
  setData: (data: InputGanttData) => {
    const rowPositions = new Map<string, number>();
    let currentY = 0;

    const enrichedData = assignColors(data);

    set({
      data: enrichedData,
      totalHeight: currentY,
      rowPositions,
    });
  },

  getRowPosition: (id: string) => {
    const { rowPositions } = get();
    return rowPositions.get(id) ?? 0;
  },
  setTimeScale: (scale: TimeScale) => {
    const { width, startDate: currentStartDate, endDate } = get();
    const rawStartDate = new Date(currentStartDate); // Store the original start date
    const newStartDate = calculateChartStartDate(rawStartDate, scale);
    const daysInChart = differenceInDays(endDate, newStartDate) + 1;
    const unitWidth = calculateUnitWidth(scale, width, daysInChart, newStartDate);
    const dayWidth = calculateDayWidth(scale, unitWidth, newStartDate);

    set({
      timeScale: scale,
      startDate: newStartDate,
      unitWidth,
      dayWidth,
    });
  },
  setDimensions: (width: number, startDate: Date, endDate: Date) => {
    const { timeScale } = get();
    const daysInChart = differenceInDays(endDate, startDate) + 1;
    const unitWidth = calculateUnitWidth(timeScale, width, daysInChart, startDate);
    const dayWidth = calculateDayWidth(timeScale, unitWidth, startDate);

    set({
      width,
      startDate,
      endDate,
      unitWidth,
      dayWidth,
    });
  },
  setStartOfWeek: (startOfWeekIndex: Day) => {
    set({ startOfWeekIndex });
  },
  setGridWidth: (gridWidth: number) => {
    set({ gridWidth });
  },
  toggleColumn: (columnId: ColumnId) => {
    const { visibleColumns } = get();
    const newVisibleColumns = new Set(visibleColumns);

    if (columnId === 'name') {
      return; // Prevent toggling the name column as it should always be visible
    }

    if (newVisibleColumns.has(columnId)) {
      newVisibleColumns.delete(columnId);
    } else {
      newVisibleColumns.add(columnId);
    }

    set({ visibleColumns: newVisibleColumns });
  },
  setVisibleColumns: (columns: ColumnId[]) => {
    // Ensure 'name' is always included
    const newColumns = new Set([...columns]);
    newColumns.add('name');
    set({ visibleColumns: newColumns });
  },
}));
