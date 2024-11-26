type ColorVariation = {
  hex: string;
  order: number;
  isBase?: boolean;
};

type ColorGroup = {
  name: string;
  description: string;
  baseColor: string;
  variations: ColorVariation[];
};

interface ColorConfig {
  version: string;
  lastUpdated: string;
  groups: ColorGroup[];
}

const colorConfig: ColorConfig = {
  version: '1.0.0',
  lastUpdated: '2024-11-23',
  groups: [
    {
      name: 'ocean',
      description: 'Ocean blue variations for primary actions and highlights',
      baseColor: '#4793AF',
      variations: [
        { hex: '#2A5B6B', order: 1 },
        { hex: '#3B7189', order: 2 },
        { hex: '#4788A2', order: 3 },
        { hex: '#4793AF', order: 4, isBase: true },
        { hex: '#5EA3BC', order: 5 },
        { hex: '#75B3C9', order: 6 },
        { hex: '#8CC3D6', order: 7 },
        { hex: '#A3D3E3', order: 8 },
        { hex: '#B0DDE9', order: 9 },
      ],
    },
    {
      name: 'sunset',
      description: 'Warm orange variations for warnings and notifications',
      baseColor: '#FFC470',
      variations: [
        { hex: '#E6A245', order: 1 },
        { hex: '#F5B355', order: 2 },
        { hex: '#FFC165', order: 3 },
        { hex: '#FFC470', order: 4, isBase: true },
        { hex: '#FFCD89', order: 5 },
        { hex: '#FFD6A2', order: 6 },
        { hex: '#FFDFBB', order: 7 },
        { hex: '#FFE8D4', order: 8 },
        { hex: '#FFEEE2', order: 9 },
      ],
    },
    {
      name: 'sage',
      description: 'Natural green variations for success states and growth indicators',
      baseColor: '#4B7355',
      variations: [
        { hex: '#2F4735', order: 1 },
        { hex: '#3C5C44', order: 2 },
        { hex: '#476B50', order: 3 },
        { hex: '#4B7355', order: 4, isBase: true },
        { hex: '#638569', order: 5 },
        { hex: '#7B977D', order: 6 },
        { hex: '#93A991', order: 7 },
        { hex: '#ABBBA5', order: 8 },
        { hex: '#B9C7B2', order: 9 },
      ],
    },
    {
      name: 'coral',
      description: 'Bright red variations for errors and critical actions',
      baseColor: '#DD5746',
      variations: [
        { hex: '#B13838', order: 1 },
        { hex: '#C94545', order: 2 },
        { hex: '#D95242', order: 3 },
        { hex: '#DD5746', order: 4, isBase: true },
        { hex: '#E46D5E', order: 5 },
        { hex: '#EB8376', order: 6 },
        { hex: '#F2998E', order: 7 },
        { hex: '#F9AFA6', order: 8 },
        { hex: '#FCBBB4', order: 9 },
      ],
    },
  ],
};

export default colorConfig;
