/**
 * Converts a hex color to rgba format with specified opacity
 * @param hex - Hex color string (e.g., '#38bdf8')
 * @param alpha - Opacity value between 0 and 1
 * @returns rgba color string (e.g., 'rgba(56, 189, 248, 0.6)')
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  // Handle invalid hex colors
  if (!hex || !hex.startsWith('#')) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle both 3 and 6 character hex codes
  const r = parseInt(cleanHex.length === 3 ? cleanHex[0].repeat(2) : cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.length === 3 ? cleanHex[1].repeat(2) : cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.length === 3 ? cleanHex[2].repeat(2) : cleanHex.slice(4, 6), 16);

  // Validate RGB values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
