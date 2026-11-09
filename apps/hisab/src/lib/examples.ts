/** The opening demonstration. Made-up data, in the shapes Hisab really records (see its golden SMS cases). */
export interface Example {
	tab: string;
	who: string;
	said: string;
	message: boolean;
	lines: { account: string; debit?: string; credit?: string }[];
	total: string;
	note: string;
}

export const EXAMPLES: Example[] = [
	{
		tab: 'You say it',
		who: 'You, in Claude',
		said: 'Lunch with Rafi, 640 taka from bKash',
		message: false,
		lines: [
			{ account: 'Expenses:Dining out', debit: '640.00' },
			{ account: 'Assets:bKash', credit: '640.00' },
		],
		total: 'Tk 640.00',
		note: 'Marked as logged by Claude. You can undo it.',
	},
	{
		tab: 'Your bank texts it',
		who: 'bKash, to your phone',
		said: 'Payment Tk 540.00 to Corner Bazar successful. Fee Tk 0.00. Balance Tk 1,300.67. TrxID 9K7A6B5C4F at 07/11/2026 14:32',
		message: true,
		lines: [
			{ account: 'Expenses:Groceries', debit: '540.00' },
			{ account: 'Assets:bKash', credit: '540.00' },
		],
		total: 'Tk 540.00',
		note: 'Read on your phone. The category comes from how you booked this shop before, and the message stays on the phone.',
	},
	{
		tab: 'You snap it',
		who: 'A photo of a receipt',
		said: 'Green Leaf Market, 23.40 pounds, paid by card',
		message: false,
		lines: [
			{ account: 'Expenses:Groceries', debit: '23.40' },
			{ account: 'Liabilities:Credit card', credit: '23.40' },
		],
		total: '£23.40',
		note: 'You confirm what it read, and the photo stays attached to the entry.',
	},
];
