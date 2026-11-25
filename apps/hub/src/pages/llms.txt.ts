import { llmsTxt } from '../lib/llms.ts';

export const prerender = true;

export function GET() {
	return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
