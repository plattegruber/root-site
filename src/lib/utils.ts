import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditional class composition with Tailwind-aware merging.
 *
 * Mirrors the shadcn `cn` helper: clsx handles conditionals, twMerge
 * resolves conflicting Tailwind utilities so consumer-passed classes
 * always win (e.g. <Button class="bg-ink"> overrides bg-root).
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
