/** A thought captured during a timed shower. */
export interface ShowerThought { id: string; text: string; createdAt: string; elapsedSeconds: number; }
export interface StoredThoughts { version: 1; thoughts: ShowerThought[]; }
