/**
 * Moving between the hub's own pages (same origin): the browser's cross-document view transitions
 * (CSS `@view-transition` in tokens.css) cross-fade the pages, and the hour the visitor chose grows
 * into its chapter page: the light of a finale constellation, or a home moment's light, becomes the
 * chapter's hero, and back again. Only one element carries the name at a time, and only for the
 * length of the transition. Browsers without them simply navigate.
 */
const CHAPTER = /^\/(time|attention|health|wealth|relationships|self|faith)\/$/;
const NAME = 'chapter-hour';

type SwapEvent = Event & { viewTransition: ViewTransition | null; activation: { entry: { url: string } } | null };

const chapterOf = (path: string) => CHAPTER.exec(path)?.[1] ?? null;

/** What stands for this chapter on this page: its hero here, or its light on the home page. */
function hourOn(id: string, clicked: Element | null): HTMLElement | null {
	const hero = document.querySelector<HTMLElement>(`main[data-chapter="${id}"] .hero`);
	if (hero) return hero;
	if (clicked?.matches(`a[data-light="${id}"]`)) return clicked.querySelector<HTMLElement>('.star') ?? (clicked as HTMLElement);
	return document.querySelector<HTMLElement>(`[data-moment="${id}"] .when .light`);
}

function name(el: HTMLElement | null, done: Promise<unknown> | undefined) {
	if (!el) return;
	el.style.viewTransitionName = NAME;
	void done?.finally(() => { el.style.viewTransitionName = ''; });
}

export function watchTransitions(): void {
	let clicked: Element | null = null;
	document.addEventListener('click', (e) => { clicked = (e.target as Element | null)?.closest?.('a[href]') ?? null; }, true);

	// Leaving: name the hour being left for (or the chapter being left).
	addEventListener('pageswap', (ev) => {
		const e = ev as SwapEvent;
		if (!e.viewTransition || !e.activation) return;
		// From a chapter page its hero goes; elsewhere, the light of the chapter being opened.
		const here = chapterOf(location.pathname);
		const id = here ?? chapterOf(new URL(e.activation.entry.url).pathname);
		if (id) name(hourOn(id, clicked), e.viewTransition.finished);
	});
	// Arriving is named by an inline script in Base.astro's <head>: pagereveal can come before this
	// module runs.
}
