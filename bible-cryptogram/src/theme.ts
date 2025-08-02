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
  { id: 3, name: 'green', color: '#006400', textColor: '#FFFFFF' },
  { id: 4, name: 'orange', color: '#FF8C00', textColor: 'var(--color-bg-dark)' },
  { id: 5, name: 'purple', color: '#9370DB', textColor: '#FFFFFF' },
  { id: 6, name: 'cyan', color: '#00FFFF', textColor: 'var(--color-bg-dark)' },
  { id: 7, name: 'brown', color: '#8B4513', textColor: '#FFFFFF' },
  { id: 8, name: 'lime', color: '#00FF00', textColor: 'var(--color-bg-dark)' },
  { id: 9, name: 'yellow', color: '#FFFF00', textColor: 'var(--color-bg-dark)' },
  { id: 10, name: 'pink', color: '#FF69B4', textColor: 'var(--color-bg-dark)' }
];

// Color wheel format for ReferenceMatchGame (Record<number, { color: string; name: string }>)
export const COLOR_WHEEL: Record<number, { color: string; name: string }> = 
  COLOR_WHEEL_ITEMS.reduce((acc, item) => {
    acc[item.id] = { color: item.color, name: item.name };
    return acc;
  }, {} as Record<number, { color: string; name: string }>);

// Button Theme Definitions
export interface ButtonTheme {
  padding: string;
  fontSize: string;
  fontWeight: string;
  background: string;
  color: string;
  border: string;
  borderRadius: string;
  cursor: string;
  transition: string;
  fontFamily: string;
  backdropFilter: string;
  display: string;
  alignItems: string;
  justifyContent: string;
  gap: string;
  minHeight: string;
  
  // Hover states
  hoverBackground: string;
  hoverTransform: string;
  hoverBoxShadow: string;
  
  // Disabled states
  disabledOpacity: string;
  disabledCursor: string;
  disabledTransform: string;
  disabledBoxShadow: string;
  disabledBorderColor: string;
  disabledHoverBackground: string;
}

// Glass-style buttons (matching FirstLetterTestGame's style)
export const GLASS_BUTTON_THEME: ButtonTheme = {
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 'bold',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#e6ccff',
  border: '2px solid #800080',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: "'Courier New', Courier, monospace",
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '45px',
  
  // Hover states
  hoverBackground: 'rgba(128, 0, 128, 0.2)',
  hoverTransform: 'translateY(-2px)',
  hoverBoxShadow: '0 4px 12px rgba(128, 0, 128, 0.3)',
  
  // Disabled states
  disabledOpacity: '0.5',
  disabledCursor: 'not-allowed',
  disabledTransform: 'none',
  disabledBoxShadow: 'none',
  disabledBorderColor: '#800080',
  disabledHoverBackground: 'rgba(255, 255, 255, 0.1)'
};

// Mobile responsive adjustments for glass buttons
export const GLASS_BUTTON_MOBILE = {
  fontSize: '1rem',
  padding: '10px 20px',
  minHeight: '40px',
  
  // Small mobile
  smallMobile: {
    fontSize: '1rem',
    padding: '8px 16px',
    minHeight: '36px'
  }
};

/*
  //optional color wheell

  // Comprehensive color wheel definition with all properties
export const COLOR_WHEEL_ITEMS: ColorWheelItem[] = [
    { id: 1, name: 'dark blue', color: '#001a98', textColor: '#FFFFFF' },
    { id: 2, name: 'red', color: '#ff1e26', textColor: '#FFFFFF' },
    { id: 3, name: 'green', color: '#06bd00', textColor: '#FFFFFF' },
    { id: 4, name: 'orange', color: '#fe941e', textColor: 'var(--color-bg-dark)' },
    { id: 5, name: 'bright pink', color: '#ff00ff', textColor: 'var(--color-bg-dark)' },
    { id: 6, name: 'light blue', color: '#55cdfd', textColor: 'var(--color-bg-dark)' },
    { id: 7, name: 'brown', color: '#604814', textColor: '#FFFFFF' },
    { id: 8, name: 'purple', color: '#760088', textColor: 'var(--color-bg-dark)' },
    { id: 9, name: 'yellow', color: '#ffff00', textColor: 'var(--color-bg-dark)' },
    { id: 10, name: 'light pink', color: '#f6aab7', textColor: 'var(--color-bg-dark)' }
  ];

  //
*/