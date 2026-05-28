/**
 * Public barrel for the lib/ package.
 *
 * Components are also reachable via their nested barrels
 * (`$lib/components/ui`, `$lib/components/layout`) for tree-shake-friendly
 * imports in route files.
 */
export * from './components/ui';
export * from './components/layout';
export { cn } from './utils';
export { site, nav } from './config/site';
