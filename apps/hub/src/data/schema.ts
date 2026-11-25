/**
 * The hub's schema.org graph. Every app site declares its own SoftwareApplication under its own host
 * (appSchemaId) with Intently as publisher; the hub declares the studio, its website and the list of
 * apps by those same @ids, so search and answer engines read one graph across the subdomains.
 */
import { APPS, STUDIO, appSchemaId, type App } from '@intently/registry';

export const ORG_ID = `${STUDIO.url}/#organization`;
export const WEBSITE_ID = `${STUDIO.url}/#website`;

export function organization() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORG_ID,
		name: STUDIO.name,
		url: STUDIO.url,
		logo: `${STUDIO.url}/logo.png`,
		email: STUDIO.email,
		founder: { '@type': 'Person', name: STUDIO.owner },
		brand: APPS.map((a) => ({ '@type': 'Brand', name: a.name, url: `https://${a.host}/` })),
	};
}

export function website() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: STUDIO.name,
		url: `${STUDIO.url}/`,
		publisher: { '@id': ORG_ID },
		inLanguage: 'en',
	};
}

/** The apps, in the hub's order, each pointing at the SoftwareApplication its own site declares. */
export function appList(apps: App[] = APPS) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		'@id': `${STUDIO.url}/#apps`,
		name: `Apps by ${STUDIO.name}`,
		itemListElement: apps.map((a, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: a.name,
			url: `https://${a.host}/`,
			item: { '@id': appSchemaId(a) },
		})),
	};
}
