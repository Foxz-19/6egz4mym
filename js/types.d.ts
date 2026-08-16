export interface Swatch { id: string; label: string; hex: string; }
export interface LoadResult { swatches: Swatch[]; message?: string; }
