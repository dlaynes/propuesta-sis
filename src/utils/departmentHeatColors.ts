/** Color interpolation utilities shared between 2D and 3D map visualizations. */

/** Convert a 6-digit hex color to an [r, g, b] tuple of integers 0-255. */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

/** Convert an [r, g, b] tuple of integers 0-255 to a 6-digit hex color string. */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
}

/** Linearly interpolate two 6-digit hex colors. `factor` 0 = color1, 1 = color2. */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  return rgbToHex(
    r1 + (r2 - r1) * factor,
    g1 + (g2 - g1) * factor,
    b1 + (b2 - b1) * factor,
  );
}

import type { DepartamentoStat } from '../types/pueblos_indigenas';

/** Build a map of department code -> heat-map fill color. The maximum `localidades` count
 * determines the upper bound; lighter = lower, darker = higher. */
export function computeDepartmentHeatColors(
  deptRows: DepartamentoStat[],
  lightHex = '#f0fdf4',
  darkHex = '#15803d',
): Record<string, string> {
  if (deptRows.length === 0) return {};
  const max = Math.max(...deptRows.map((d) => d.localidades));
  const fills: Record<string, string> = {};
  for (const row of deptRows) {
    const intensity = max > 0 ? row.localidades / max : 0;
    fills[row.codigo] = interpolateColor(lightHex, darkHex, intensity);
  }
  return fills;
}
