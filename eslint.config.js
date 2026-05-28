import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		rules: {
			// Disabled deliberately. The rule wants every internal href to be
			// wrapped in `resolve()` from $app/paths so SvelteKit's typed
			// routing can validate it. For this project:
			//   - Polymorphic components (Button, NavLink) accept dynamic
			//     hrefs from arbitrary callers; their hrefs aren't statically
			//     known.
			//   - The /writing/<slug> placeholder posts in lib/config/blog.ts
			//     don't have route files yet (intentional — they're stubs).
			// Both make typed resolve() fail at compile time without runtime
			// benefit: the site has no `paths.base` and no route ID coercion
			// is needed. Re-enable when posts get real +page.svelte files
			// and the polymorphic href types can be tightened.
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
