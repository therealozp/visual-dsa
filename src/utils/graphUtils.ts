/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphData } from '../components/interfaces/graph.interfaces';

type IdRef = string | { id: string } | any; // tolerate renderer mutations

export const asId = (v: IdRef): string =>
	typeof v === 'string' ? v : (v?.id ?? String(v));

// Keep only ID endpoints; preserve extra fields like weight if present
export const normalizeGraph = (g: GraphData): GraphData => ({
	nodes: g.nodes.map((n) => ({ ...n })), // shallow copy to avoid external mutation
	links: g.links.map((l: any) => ({
		source: asId(l.source),
		target: asId(l.target),
		...(l.weight != null ? { weight: l.weight } : {}),
	})),
});
