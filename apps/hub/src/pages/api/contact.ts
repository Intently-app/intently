/**
 * Contact form: delivers the message by Resend to the inbox of the app it's about.
 * The work is in src/lib/contact.ts; this file only wires it to Astro and the Worker's secrets.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { handleContact, notAllowed } from '../../lib/contact';

export const POST: APIRoute = ({ request, locals }) =>
	handleContact(request, { apiKey: locals.runtime?.env?.RESEND_API_KEY });

// The endpoint only takes the form's POST; crawlers that find the URL get 405, not a 500 or 404.
export const GET: APIRoute = () => notAllowed();
