/**
 * Respite's arrival world: the visitor dived in from liveintently.app's Attention hour. Respite's
 * colour becomes mist that keeps the dive's speed and parts from the middle (@intently/world mist).
 * On wide screens the 3D phone then flies forward from the distance into its place in the hero
 * (PhoneJourney.astro waits for intently:arrived, so its start-up never holds up the mist).
 */
import { app } from '@intently/registry';
import { startMist } from '@intently/world/worlds/mist';

export function startArrival(): void {
	startMist(app('respite').color);
}
