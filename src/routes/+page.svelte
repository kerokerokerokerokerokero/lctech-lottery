<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	type Member = { id: string; name: string };
	let { data } = $props<{ data: { members: Member[]; source: string } }>();

	const STORAGE_KEY = 'lctech-lottery-state-v1';

	const allMembers = [...data.members];
	let remaining = $state<Member[]>([...allMembers]);
	let winners = $state<Member[]>([]);
	let drawCount = $state(1);
	let currentName = $state('準備抽獎');
	let drawing = $state(false);
	let message = $state('');

	function shuffle<T>(arr: T[]) {
		const next = [...arr];
		for (let i = next.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[next[i], next[j]] = [next[j], next[i]];
		}
		return next;
	}

	function persist() {
		if (!browser) return;
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ winners: winners.map((w) => w.id), remaining: remaining.map((r) => r.id) })
		);
	}

	onMount(() => {
		if (!browser || allMembers.length === 0) return;
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		try {
			const saved = JSON.parse(raw) as { winners: string[]; remaining: string[] };
			const map = new Map(allMembers.map((m) => [m.id, m]));
			winners = (saved.winners ?? []).map((id) => map.get(id)).filter(Boolean) as Member[];
			remaining = (saved.remaining ?? []).map((id) => map.get(id)).filter(Boolean) as Member[];
			if (remaining.length === 0 && winners.length > 0) {
				remaining = allMembers.filter((m) => !winners.some((w) => w.id === m.id));
			}
		} catch {
			// ignore broken state
		}
	});

	async function runDraw() {
		if (drawing || remaining.length === 0) return;
		drawing = true;
		message = '';
		const want = Math.max(1, Math.floor(drawCount || 1));
		const count = Math.min(want, remaining.length);

		let ticks = 0;
		const spinMs = 1500;
		const interval = setInterval(() => {
			const idx = Math.floor(Math.random() * remaining.length);
			currentName = remaining[idx]?.name ?? '抽獎中...';
			ticks += 1;
		}, 60);

		await new Promise((r) => setTimeout(r, spinMs));
		clearInterval(interval);

		const picked = shuffle(remaining).slice(0, count);
		winners = [...picked, ...winners];
		const pickedIds = new Set(picked.map((p) => p.id));
		remaining = remaining.filter((m) => !pickedIds.has(m.id));
		currentName = picked.map((p) => p.name).join('、');
		message = `本輪抽出 ${picked.length} 位`; 
		drawing = false;
		persist();
	}

	function clearOne(id: string) {
		const target = winners.find((w) => w.id === id);
		if (!target) return;
		winners = winners.filter((w) => w.id !== id);
		remaining = [...remaining, target];
		persist();
	}

	function clearAll() {
		remaining = [...allMembers];
		winners = [];
		currentName = '準備抽獎';
		message = '已清除全部得獎名單';
		persist();
	}
</script>

<main class="casino-bg">
	<section class="card">
		<h1>🎰 LC TECH 抽獎機</h1>
		<p class="source">名單來源：<a href={data.source} target="_blank" rel="noreferrer">team.php</a></p>

		<div class="display" class:drawing={drawing}>
			<div class="label">目前顯示</div>
			<div class="name">{currentName}</div>
		</div>

		<div class="controls">
			<label>
				連續抽獎數量
				<input type="number" min="1" bind:value={drawCount} />
			</label>
			<button onclick={runDraw} disabled={drawing || remaining.length === 0}>開始抽獎</button>
		</div>

		{#if message}
			<p class="msg">{message}</p>
		{/if}

		<div class="stats">
			<span>可抽名單：{remaining.length}</span>
			<span>已中獎：{winners.length}</span>
		</div>
	</section>

	<section class="card winners">
		<div class="winner-header">
			<h2>得獎名單</h2>
			<button class="danger" onclick={clearAll} disabled={winners.length === 0}>全部清除</button>
		</div>

		{#if winners.length === 0}
			<p class="empty">尚未抽出得獎者</p>
		{:else}
			<ul>
				{#each winners as winner, i (winner.id)}
					<li>
						<span>#{i + 1} {winner.name}</span>
						<button class="small" onclick={() => clearOne(winner.id)}>單一清除</button>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
		background: radial-gradient(circle at top, #3b0a0a, #120404 60%);
		color: #f8e7b5;
	}

	.casino-bg {
		min-height: 100vh;
		padding: 2rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1.2fr 1fr;
	}

	.card {
		background: linear-gradient(160deg, rgba(40, 0, 0, 0.85), rgba(10, 10, 10, 0.9));
		border: 1px solid #d4af37;
		border-radius: 16px;
		padding: 1.2rem;
		box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
	}

	h1, h2 { margin: 0 0 0.5rem 0; color: #ffd86b; }
	.source { margin: 0 0 1rem; font-size: 0.9rem; opacity: 0.9; }
	.source a { color: #ffd86b; }

	.display {
		padding: 1rem;
		border-radius: 12px;
		background: #1f1010;
		border: 1px solid #7e5b13;
		margin-bottom: 1rem;
	}
	.display.drawing .name {
		animation: flicker 0.08s infinite alternate;
	}
	.label { font-size: 0.85rem; opacity: 0.8; }
	.name { font-size: 2rem; font-weight: 700; min-height: 3rem; }

	.controls { display: flex; gap: 0.8rem; align-items: end; }
	input {
		width: 90px;
		padding: 0.45rem;
		border-radius: 8px;
		border: 1px solid #d4af37;
		background: #2a1919;
		color: #fff;
	}
	button {
		padding: 0.55rem 0.9rem;
		border: 0;
		border-radius: 10px;
		background: linear-gradient(180deg, #ffd86b, #c08711);
		color: #1d1201;
		font-weight: 700;
		cursor: pointer;
	}
	button:disabled { opacity: 0.45; cursor: not-allowed; }
	button.danger { background: linear-gradient(180deg, #ff8b8b, #c02b2b); color: #fff; }
	button.small { padding: 0.35rem 0.65rem; font-size: 0.85rem; }

	.stats { display: flex; gap: 1rem; margin-top: 1rem; opacity: 0.95; }
	.msg { color: #ffe9a3; margin: 0.75rem 0 0; }
	.winner-header { display: flex; justify-content: space-between; align-items: center; }
	ul { list-style: none; padding: 0; margin: 0.5rem 0 0; max-height: 60vh; overflow: auto; }
	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.6rem;
		border-bottom: 1px solid rgba(255, 216, 107, 0.2);
	}
	.empty { opacity: 0.8; }

	@keyframes flicker {
		from { opacity: 0.7; transform: scale(0.99); }
		to { opacity: 1; transform: scale(1.01); }
	}

	@media (max-width: 900px) {
		.casino-bg { grid-template-columns: 1fr; padding: 1rem; }
		.name { font-size: 1.5rem; }
	}
</style>
