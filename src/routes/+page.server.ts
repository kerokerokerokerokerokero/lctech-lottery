import type { PageServerLoad } from './$types';

type Member = {
	id: string;
	name: string;
};

const TEAM_URL = 'https://www.lctech.com.tw/team.php';

const clean = (v: string) =>
	v
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

function parseMembers(html: string): Member[] {
	const liMatches = html.match(/<li>[\s\S]*?<\/li>/g) ?? [];
	const names: Member[] = [];

	for (const li of liMatches) {
		const last = li.match(/<div class="last-name">([\s\S]*?)<\/div>/)?.[1] ?? '';
		const first = li.match(/<div class="first-name">([\s\S]*?)<\/div>/)?.[1] ?? '';
		const full = clean(`${clean(last)} ${clean(first)}`);
		if (!full) continue;
		names.push({ id: `${full}-${names.length}`, name: full });
	}

	// 去重（同名保留第一個）
	const seen = new Set<string>();
	return names.filter((m) => {
		if (seen.has(m.name)) return false;
		seen.add(m.name);
		return true;
	});
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch(TEAM_URL);
		if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
		const html = await res.text();
		const members = parseMembers(html);
		return { members, source: TEAM_URL };
	} catch {
		return { members: [], source: TEAM_URL };
	}
};
