/**
 * Facts the whole site repeats. Every claim here has to stay true of the code in Intently-app/hisab and
 * Intently-app/hisab-android: check before changing a status.
 */
export const SITE = {
	name: 'Hisab',
	fullName: 'Hisab by Intently',
	url: 'https://hisab.liveintently.app',
	email: 'support@liveintently.app',
	title: 'Hisab by Intently: AI ledger for Claude and bank texts',
	description:
		'Log spending by telling Claude, or let bank and wallet texts do it. Hisab keeps real double-entry books and draws your reports. Join the waitlist.',
	status: 'In private testing on web and Android. iPhone comes after.',
} as const;

export const STUDIO = {
	name: 'Intently',
	url: 'https://liveintently.app',
	owner: 'MD Sadakat Hussain Fahad',
} as const;

export type Topic = 'ai' | 'sms' | 'basics';

export const TOPICS: { id: Topic; label: string; blurb: string }[] = [
	{ id: 'ai', label: 'AI and your money', blurb: 'Using Claude, ChatGPT and connectors to keep track of spending, and how to do it safely.' },
	{ id: 'sms', label: 'Bank and wallet texts', blurb: 'Turning the messages your bank, bKash or Nagad already send into records.' },
	{ id: 'basics', label: 'Bookkeeping basics', blurb: 'The ideas that make the numbers add up.' },
];

/** The ways an entry gets in, and where each really stands. */
export const WAYS_IN: { way: string; what: string; status: string }[] = [
	{ way: 'Claude and other AI apps', what: 'Say it in the chat you already use. Hisab connects over MCP, the open standard for AI apps.', status: 'Private testing' },
	{ way: 'Bank and wallet texts', what: 'Turn it on once on Android, and payments log themselves. The message text stays on your phone.', status: 'Private testing' },
	{ way: 'One line in Hisab', what: 'Type what happened on the web, or type or say it on Android, and confirm what it understood.', status: 'Private testing' },
	{ way: 'Receipts', what: 'Photograph one, share it to Hisab or upload a PDF. The file stays attached to the entry.', status: 'Private testing' },
	{ way: 'Statements', what: 'Import CSV, OFX, QFX, QIF, camt.053 or PDF. Lines you already have are spotted.', status: 'Private testing' },
	{ way: 'Forwarded email', what: 'Send receipts to your ledger’s own address, and they wait as drafts.', status: 'Built, opening soon' },
	{ way: 'iPhone', what: 'Shortcuts and Apple Pay automations, since iPhone apps can’t read texts.', status: 'Planned' },
	{ way: 'Live bank connections', what: 'Optional feeds for people who want them. Hisab works without one.', status: 'Planned' },
];

/** Template set version 2 in packages/parsers/templates/sms.json (39 formats). */
export const BANKS: { country: string; names: string[] }[] = [
	{ country: 'Bangladesh', names: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Dutch-Bangla Bank', 'BRAC Bank', 'City Bank', 'Eastern Bank', 'Standard Chartered', 'Prime Bank', 'Islami Bank'] },
	{ country: 'India', names: ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Paytm Payments Bank', 'Punjab National Bank', 'Bank of Baroda', 'Yes Bank', 'IDFC First Bank', 'Canara Bank'] },
	{ country: 'Pakistan', names: ['JazzCash', 'Easypaisa', 'HBL', 'Meezan Bank'] },
	{ country: 'Nigeria', names: ['GTBank', 'Access Bank', 'UBA', 'Zenith Bank'] },
	{ country: 'Kenya', names: ['M-PESA'] },
	{ country: 'Ghana', names: ['MTN MoMo'] },
	{ country: 'Uganda', names: ['MTN MoMo'] },
	{ country: 'South Africa', names: ['FNB'] },
	{ country: 'Philippines', names: ['GCash'] },
	{ country: 'United States', names: ['Chase', 'Bank of America', 'Wells Fargo', 'Capital One'] },
];

export const FAQ: { q: string; a: string }[] = [
	{ q: 'What is Hisab?', a: 'Hisab is a ledger you fill in by talking. Tell an AI app like Claude what you spent, or let your bank’s texts do it on Android. Hisab records each one as a balanced double-entry transaction and draws the reports you ask for on the web and your phone.' },
	{ q: 'Can I use it today?', a: 'Not yet. Hisab is in private testing on web and Android. Join the waitlist and we’ll send one email when it opens.' },
	{ q: 'Which AI apps does it work with?', a: 'Hisab connects over MCP, the open standard for linking apps to AI assistants. We have tested it with Claude, which lets every plan add a custom connector. Other MCP apps, including ChatGPT, use the same standard, but we haven’t finished checking them, and ChatGPT limits which plans can add connectors that write.' },
	{ q: 'Do I have to connect my bank?', a: 'No. Hisab never asks for a bank login. Entries come from what you say, your texts, receipts and statements.' },
	{ q: 'Can Hisab or an AI move my money?', a: 'No. Hisab has no way to pay, transfer or touch a bank account. It only keeps records.' },
	{ q: 'What can an AI change on its own?', a: 'It can add new entries and change its own recent ones, and each change is recorded and can be undone. Anything someone else entered, anything reconciled and anything older than 30 days waits for you to approve it in Hisab. An AI can’t approve its own request.' },
	{ q: 'Where is my data kept?', a: 'In the cloud on Cloudflare, with a separate database for each ledger. On Android, the text of your messages stays on your phone. Only the details of a payment are sent: amount, date, who it was to, and a fingerprint so the same message isn’t counted twice.' },
	{ q: 'How much will it cost?', a: 'It’s free during the beta. We may add paid plans later, and we’ll say so before anything changes.' },
	{ q: 'Is this financial advice?', a: 'No. Hisab keeps records and shows you your own numbers. It doesn’t tell you what to do with your money.' },
];
