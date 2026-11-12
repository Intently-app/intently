/**
 * The contact form's handler, kept free of Astro and Workers imports so node:test can run it.
 *
 * Mail goes out through Resend's REST API with a plain fetch. The `resend` SDK (6.x) pulls in
 * mailparser, whose CommonJS modules call require("stream"); in the Astro 7 server bundle that
 * becomes a dynamic require the Workers runtime refuses, so the route module threw on load and
 * every request to /api/contact answered 500 (Nov 2026).
 */
import { APPS, STUDIO } from '@intently/registry';

export const FROM = 'Intently contact form <noreply@liveintently.app>';
export const RESEND_URL = 'https://api.resend.com/emails';

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
	new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });

/** GET (a crawler, a link) and anything else that is not a form post. */
export const notAllowed = () =>
	json({ success: false, message: 'Use the form at /contact/.' }, 405, { Allow: 'POST' });

export async function handleContact(
	request: Request,
	{ apiKey, fetch: send = fetch }: { apiKey?: string; fetch?: typeof fetch },
): Promise<Response> {
	const form = await request.formData().catch(() => null);
	if (!form) return json({ success: false, message: 'Invalid form submission.' }, 400);

	const field = (key: string) => form.get(key)?.toString().trim() ?? '';
	const name = field('name');
	const email = field('email');
	const appId = field('app');
	const message = field('message');

	// Bots fill every field, including this one, which people never see.
	if (field('website')) return json({ success: true });

	const errors: Record<string, string> = {};
	if (name.length < 2) errors.name = 'Please enter your name.';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
	if (message.length < 10) errors.message = 'Please write at least a sentence.';
	if (message.length > 5000) errors.message = 'Please keep it under 5,000 characters.';
	if (Object.keys(errors).length) return json({ success: false, errors }, 400);

	const app = APPS.find((a) => a.id === appId);
	const to = app?.email ?? STUDIO.email;
	const about = app?.name ?? 'General';

	if (!apiKey) {
		console.error('RESEND_API_KEY is not set');
		return json({ success: false, message: `Sending is not set up. Please email ${to} directly.` }, 503);
	}

	let res: Response | undefined;
	try {
		res = await send(RESEND_URL, {
			method: 'POST',
			headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				from: FROM,
				to: [to],
				reply_to: email,
				subject: `[${about}] Message from ${name}`,
				text: `${message}\n\n---\nFrom: ${name} <${email}>\nAbout: ${about}\nSent from liveintently.app/contact`,
			}),
		});
	} catch (error) {
		console.error('Resend request failed', error);
	}
	if (!res?.ok) {
		if (res) console.error('Resend error', res.status, await res.text().catch(() => ''));
		return json({ success: false, message: `Sending failed. Please email ${to} directly.` }, 502);
	}
	return json({ success: true });
}
