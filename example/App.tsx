import { useEffect } from 'react';
import './App.css';
import SvgGantt from './components/SvgGantt';
import { InputGanttData } from './types/gantTypes';
import { useGanttStore } from './hooks/useGanttStore';

const mockGanttData: InputGanttData = {
  projects: [
    {
      id: '1',
      name: 'Site Preparation',
      status: 'on-track',
      type: 'project',
      startDate: '2024-11-01',
      endDate: '2024-11-26',
      duration: 22,
      expanded: true,
      isCritical: true,
      tasks: [
        {
          id: '11',
          name: 'Clear vegetation and debris',
          status: 'completed',
          type: 'task',
          startDate: '2024-11-01',
          endDate: '2024-11-08',
          duration: 8,
          isCritical: true,
          dependencies: [],
          subcontractor: 'John Doe',
        },
        {
          id: '12',
          name: 'Grade and level site',
          status: 'on-track',
          type: 'task',
          startDate: '2024-11-09',
          endDate: '2024-11-19',
          duration: 11,
          isCritical: true,
          dependencies: ['11'],
          subcontractor: 'John Doe',
        },
        {
          id: '13',
          name: 'Install temporary fencing',
          status: 'at-risk',
          type: 'task',
          startDate: '2024-11-20',
          endDate: '2024-11-22',
          duration: 3,
          isCritical: false,
          dependencies: ['12'],
          subcontractor: 'John Doe',
        },
      ],
    },
    {
      id: '2',
      name: 'Foundation Work',
      status: 'at-risk',
      type: 'project',
      startDate: '2024-11-25',
      endDate: '2024-12-14',
      duration: 21,
      expanded: true,
      isCritical: true,
      tasks: [
        {
          id: '21',
          name: 'Excavate foundation',
          type: 'task',
          status: 'on-track',
          startDate: '2024-11-25',
          endDate: '2024-12-05',
          duration: 11,
          isCritical: true,
          dependencies: ['12'],
          subcontractor: 'John Doe',
        },
        {
          id: '22',
          name: 'Install footings',
          type: 'task',
          status: 'delayed',
          startDate: '2024-12-06',
          endDate: '2024-12-14',
          duration: 9,
          isCritical: true,
          dependencies: ['21'],
          subcontractor: 'John Doe',
        },
        {
          id: '23',
          name: 'Complete Footings',
          type: 'task-milestone',
          status: 'delayed',
          startDate: '2024-12-15',
          endDate: '2024-12-15',
          duration: 1,
          isCritical: true,
          dependencies: ['22'],
          subcontractor: 'John Doe',
        },
      ],
    },
    {
      id: '4',
      name: 'Structural Framing',
      status: 'on-track',
      type: 'project',
      startDate: '2024-12-17',
      endDate: '2025-01-15',
      duration: 30,
      expanded: true,
      isCritical: true,
      tasks: [
        {
          id: '41',
          name: 'Install steel columns',
          status: 'not-started',
          type: 'task',
          startDate: '2024-12-17',
          endDate: '2024-12-31',
          duration: 15,
          isCritical: true,
          dependencies: ['23'],
          subcontractor: 'Steel Works Inc',
        },
        {
          id: '42',
          name: 'Install steel beams',
          status: 'not-started',
          type: 'task',
          startDate: '2025-01-01',
          endDate: '2025-01-15',
          duration: 15,
          isCritical: true,
          dependencies: ['41'],
          subcontractor: 'Steel Works Inc',
        },
      ],
    },
    {
      id: '5',
      name: 'Roofing',
      status: 'on-track',
      type: 'project',
      startDate: '2025-01-16',
      endDate: '2025-02-06',
      duration: 22,
      expanded: true,
      isCritical: true,
      tasks: [
        {
          id: '51',
          name: 'Install roof trusses',
          status: 'not-started',
          type: 'task',
          startDate: '2025-01-16',
          endDate: '2025-01-25',
          duration: 10,
          isCritical: true,
          dependencies: ['42'],
          subcontractor: 'Roofing Experts LLC',
        },
        {
          id: '52',
          name: 'Install roofing membrane',
          status: 'not-started',
          type: 'task',
          startDate: '2025-01-26',
          endDate: '2025-02-06',
          duration: 12,
          isCritical: true,
          dependencies: ['51'],
          subcontractor: 'Roofing Experts LLC',
        },
      ],
    },
    {
      id: '6',
      name: 'Exterior Walls',
      status: 'on-track',
      type: 'project',
      startDate: '2025-01-20',
      endDate: '2025-02-20',
      duration: 32,
      expanded: true,
      isCritical: false,
      tasks: [
        {
          id: '61',
          name: 'Install wall frames',
          status: 'not-started',
          type: 'task',
          startDate: '2025-01-20',
          endDate: '2025-02-03',
          duration: 15,
          isCritical: false,
          dependencies: ['42'],
          subcontractor: 'Wall Systems Co',
        },
        {
          id: '62',
          name: 'Install exterior cladding',
          status: 'not-started',
          type: 'task',
          startDate: '2025-02-04',
          endDate: '2025-02-20',
          duration: 17,
          isCritical: false,
          dependencies: ['61'],
          subcontractor: 'Wall Systems Co',
        },
      ],
    },
  ],
};

const App = () => {
  const setData = useGanttStore(state => state.setData);

  useEffect(() => {
    setData(mockGanttData);
  }, [mockGanttData, setData]);

  return (
    <div className="flex flex-col items-start justify-start h-screen w-screen custom-background">
      <div className="flex flex-col space-y-12 overflow-y-auto items-start justify-start h-[300vh] w-screen p-48">
        <div className="h-[70vh] w-full p-2">
          <SvgGantt />
        </div>
      </div>
    </div>
  );
};

export default App;
