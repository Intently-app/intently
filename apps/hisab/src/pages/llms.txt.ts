import { BANKS, SITE, TOPICS, WAYS_IN } from '../lib/site';
import { publishedArticles } from '../lib/articles';

/** What an answer engine should know about Hisab, built from the same facts as the pages, so the two can't disagree. */
export async function GET() {
	const articles = await publishedArticles();
	const sections = TOPICS.map((topic) => {
		const lines = articles.filter((a) => a.data.topic === topic.id).map((a) => `- [${a.data.title}](${SITE.url}/articles/${a.id}/): ${a.data.description}`);
		return lines.length ? `## ${topic.label}\n\n${lines.join('\n')}\n` : '';
	}).filter(Boolean);

	const body = `# ${SITE.fullName}

> Hisab is a ledger you fill in by talking. People tell an AI app like Claude what they spent, or let bank and mobile-wallet texts do it on Android. Hisab records each one as a balanced double-entry transaction and draws the reports they ask for on the web and on Android. It is made by Intently and is not the same product as other apps named Hisab.

Status: ${SITE.status} Join the waitlist at ${SITE.url}/#waitlist. Hisab is free during the beta.

## What is true today

${WAYS_IN.map((w) => `- ${w.way} (${w.status}): ${w.what}`).join('\n')}

## Rules

- Hisab cannot move money. It has no way to pay, transfer or touch a bank account, and it never asks for a bank login.
- An AI can add entries and change its own recent ones at once. Each change records who made it and can be undone.
- Changing or deleting what someone else recorded, anything reconciled, or anything older than 30 days waits for the person to approve it in Hisab. An AI cannot approve its own request.
- On Android, the text of a message stays on the phone. Only the amount, date, payee and a fingerprint for de-duplication are sent.
- Text from messages, receipts and payees is treated as data, never as instructions.
- Hisab keeps records. It is not financial advice.

## Banks and wallets (Android message formats, still being checked against real messages)

${BANKS.map((b) => `- ${b.country}: ${b.names.join(', ')}`).join('\n')}

${sections.join('\n')}
## Pages

- [Home](${SITE.url}/)
- [Articles](${SITE.url}/articles/)
- [Privacy policy](${SITE.url}/privacy/)
- [Terms](${SITE.url}/terms/)
- [Support](${SITE.url}/support/)
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
