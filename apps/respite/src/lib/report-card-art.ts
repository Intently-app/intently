// The real artwork on the report card (src/lib/report-card.ts), as SVG text:
// - Biscuit holding his clipboard: frame 0 of public/biscuit/read_chart.json (the calculator's own
//   Biscuit), exported with lottie-web's SVG renderer and cleaned with svgo;
// - the Respite mark: a copy of public/favicon.svg (tools/logo/respite_logo.py).
import fox from '../assets/card/biscuit-read-chart.svg?raw';
import logo from '../assets/card/respite-mark.svg?raw';
import type { CardArt } from './report-card';

export const ART: CardArt = { fox, logo };
