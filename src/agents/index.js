// index.js
// Central registry for all agents

import { HomePriceAgent } from "./HomePriceAgent";
import { CrimeAgent } from "./CrimeAgent";
// ...other agents

export const agents = [
	new HomePriceAgent(),
	new CrimeAgent(),
	// ...other agents
];

export async function gatherCityData(city) {
	return Promise.all(agents.map(agent => agent.fetch(city)));
}
