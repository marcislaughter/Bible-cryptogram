// Color wheel type definitions
export interface ColorWheelItem {
  id: number;
  name: string;
  color: string;
  textColor: string;
}

// Comprehensive color wheel definition with all properties
export const COLOR_WHEEL_ITEMS: ColorWheelItem[] = [
  { id: 1, name: 'dark blue', color: '#00008B', textColor: '#FFFFFF' },
  { id: 2, name: 'red', color: '#8B0000', textColor: '#FFFFFF' },
  { id: 3, name: 'green', color: '#228B22', textColor: '#FFFFFF' },
  { id: 4, name: 'orange', color: '#FF8C00', textColor: '#000000' },
  { id: 5, name: 'purple', color: '#9370DB', textColor: '#FFFFFF' },
  { id: 6, name: 'cyan', color: '#00FFFF', textColor: '#000000' },
  { id: 7, name: 'brown', color: '#8B4513', textColor: '#FFFFFF' },
  { id: 8, name: 'lime', color: '#00FF00', textColor: '#000000' },
  { id: 9, name: 'yellow', color: '#FFFF00', textColor: '#000000' },
  { id: 10, name: 'pink', color: '#FF69B4', textColor: '#000000' }
];

// Color wheel format for ReferenceMatchGame (Record<number, { color: string; name: string }>)
export const COLOR_WHEEL: Record<number, { color: string; name: string }> = 
  COLOR_WHEEL_ITEMS.reduce((acc, item) => {
    acc[item.id] = { color: item.color, name: item.name };
    return acc;
  }, {} as Record<number, { color: string; name: string }>);

/*
  //optional color wheell

  // Comprehensive color wheel definition with all properties
export const COLOR_WHEEL_ITEMS: ColorWheelItem[] = [
    { id: 1, name: 'dark blue', color: '#001a98', textColor: '#FFFFFF' },
    { id: 2, name: 'red', color: '#ff1e26', textColor: '#FFFFFF' },
    { id: 3, name: 'green', color: '#06bd00', textColor: '#FFFFFF' },
    { id: 4, name: 'orange', color: '#fe941e', textColor: '#000000' },
    { id: 5, name: 'bright pink', color: '#ff00ff', textColor: '#000000' },
    { id: 6, name: 'light blue', color: '#55cdfd', textColor: '#000000' },
    { id: 7, name: 'brown', color: '#604814', textColor: '#FFFFFF' },
    { id: 8, name: 'purple', color: '#760088', textColor: '#000000' },
    { id: 9, name: 'yellow', color: '#ffff00', textColor: '#000000' },
    { id: 10, name: 'light pink', color: '#f6aab7', textColor: '#000000' }
  ];

  //
*/