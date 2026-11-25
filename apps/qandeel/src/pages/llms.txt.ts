import { app } from '@intently/registry';
import { appLlmsTxt } from '@intently/ui/llms';
import { content } from '../content';

export function GET() {
	return new Response(appLlmsTxt(app('qandeel'), content), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
