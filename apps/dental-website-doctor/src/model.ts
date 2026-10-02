import { z } from 'zod';

export const areaSchema = z.enum(['experience', 'google', 'technical', 'content']);
export const evidenceSchema = z.object({
	url: z.string().max(2048),
	observedAt: z.string(),
	method: z.string(),
	detail: z.string().max(4000)
});
export const findingSchema = z.object({
	id: z.string(),
	area: areaSchema,
	title: z.string(),
	status: z.enum(['passed', 'failed', 'not_tested', 'needs_confirmation']),
	priority: z.enum(['urgent', 'improvement', 'polish', 'none']),
	severity: z.enum(['high', 'moderate', 'low', 'info']),
	evidence: z.array(evidenceSchema),
	impact: z.string(),
	fix: z.string(),
	effort: z.string(),
	section: z
		.enum(['homepage', 'new_patient', 'emergency', 'service', 'insurance', 'contact', 'team'])
		.optional()
});
export type Finding = z.infer<typeof findingSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type Area = z.infer<typeof areaSchema>;
export const factSchema = z.object({
	key: z.string(),
	value: z.string(),
	verification: z.enum(['observed', 'cross_checked']),
	evidence: z.array(evidenceSchema)
});
export type Fact = z.infer<typeof factSchema>;
export const inputSchema = z
	.object({
		websiteUrl: z.string().min(4).max(2048),
		googleMapsUrl: z.string().max(2048).optional()
	})
	.strict();
export type AuditInput = z.infer<typeof inputSchema>;

export const reportSchema = z.object({
	schemaVersion: z.literal('1.0'),
	publisher: z.literal('root.site'),
	fixture: z.boolean(),
	startedAt: z.string(),
	completedAt: z.string(),
	input: inputSchema,
	practice: z.object({
		name: z.string(),
		websiteUrl: z.string(),
		resolution: z.enum(['single_location_observed', 'ambiguous', 'unresolved']),
		explanation: z.string(),
		facts: z.array(factSchema),
		locations: z.array(z.string())
	}),
	summary: z.string(),
	findings: z.array(findingSchema),
	journeys: z.array(
		z.object({
			name: z.string(),
			status: z.enum(['passed', 'friction', 'not_tested']),
			steps: z.array(
				z.object({ label: z.string(), url: z.string().optional(), observation: z.string() })
			),
			findingIds: z.array(z.string())
		})
	),
	google: z.object({
		source: z.enum(['website_public', 'places_api', 'owner_authorized']),
		match: z.enum(['matched', 'candidate', 'ambiguous', 'unresolved']),
		explanation: z.string(),
		mapsUrl: z.string().optional(),
		fields: z.array(
			z.object({
				name: z.string(),
				availability: z.enum(['observed', 'not_exposed', 'owner_access_required', 'unresolved']),
				value: z.string().optional(),
				evidence: z.array(evidenceSchema)
			})
		),
		attributions: z.array(z.object({ name: z.string(), url: z.string().optional() })),
		ownerAccessPath: z.array(z.string())
	}),
	performance: z.array(
		z.object({
			device: z.enum(['mobile', 'desktop']),
			source: z.enum(['pagespeed_insights', 'browser_navigation']),
			status: z.enum(['completed', 'not_tested', 'failed']),
			measuredAt: z.string(),
			url: z.string(),
			conditions: z.string(),
			lab: z
				.object({
					metrics: z.record(z.number()),
					lighthouseVersion: z.string().optional(),
					environment: z.string().optional()
				})
				.optional(),
			field: z
				.object({
					scope: z.enum(['url', 'origin', 'unavailable']),
					metrics: z.record(
						z.object({ percentile: z.number(), category: z.string(), unit: z.string() })
					),
					explanation: z.string()
				})
				.optional(),
			limitation: z.string()
		})
	),
	browser: z.object({
		status: z.enum(['completed', 'partial', 'not_tested', 'failed']),
		conditions: z.string(),
		views: z.array(
			z.object({
				url: z.string(),
				width: z.number(),
				height: z.number(),
				measuredAt: z.string(),
				horizontalOverflow: z.boolean(),
				smallTapTargets: z.number(),
				axeViolations: z.array(
					z.object({
						id: z.string(),
						impact: z.string(),
						count: z.number(),
						help: z.string(),
						selectors: z.array(z.string())
					})
				),
				keyboard: z.object({
					tabbable: z.number(),
					reached: z.number(),
					invisibleFocus: z.number(),
					trapSuspected: z.boolean()
				}),
				formCount: z.number(),
				phoneLinks: z.array(z.string()),
				navigationLinks: z.number(),
				resourceBytes: z.number(),
				oversizedImages: z.array(z.string()),
				renderBlocking: z.number(),
				scriptCount: z.number(),
				fontCount: z.number()
			})
		),
		errors: z.array(z.string())
	}),
	rewrites: z.array(
		z.object({
			section: z.string(),
			sourceUrl: z.string(),
			findingIds: z.array(z.string()),
			before: z.string(),
			proposedHeading: z.string(),
			proposedCopy: z.string(),
			reason: z.string(),
			preservedFactKeys: z.array(z.string()),
			confirmations: z.array(z.string()),
			voice: z.string()
		})
	),
	generationBrief: z.object({
		version: z.literal('1.0'),
		publicationAllowed: z.literal(false),
		facts: z.array(factSchema),
		proposedSections: z.array(
			z.object({
				section: z.string(),
				heading: z.string(),
				copy: z.string(),
				sourceUrl: z.string(),
				confirmations: z.array(z.string())
			})
		),
		recommendedStructure: z.array(z.string()),
		unresolvedFacts: z.array(z.string())
	}),
	coverage: z.array(
		z.object({
			area: areaSchema,
			completed: z.number(),
			notTested: z.number(),
			failed: z.number(),
			needsConfirmation: z.number()
		})
	),
	sources: z.array(evidenceSchema),
	limits: z.array(z.string()),
	crawl: z.object({
		pagesFetched: z.number(),
		linksChecked: z.number(),
		maxPages: z.number(),
		maxLinks: z.number(),
		errors: z.array(z.string())
	})
});
export type Report = z.infer<typeof reportSchema>;

export function evidence(
	url: string,
	detail: string,
	method = 'Public HTML inspection',
	observedAt = new Date().toISOString()
): Evidence {
	return { url, detail: detail.slice(0, 4000), method, observedAt };
}
export function finding(
	id: string,
	area: Area,
	title: string,
	status: Finding['status'],
	options: Partial<Omit<Finding, 'id' | 'area' | 'title' | 'status'>> = {}
): Finding {
	return {
		id,
		area,
		title,
		status,
		priority: status === 'failed' ? 'improvement' : 'none',
		severity: status === 'failed' ? 'moderate' : 'info',
		evidence: [],
		impact: '',
		fix: '',
		effort: 'No change required',
		...options
	};
}
