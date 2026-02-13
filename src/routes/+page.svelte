<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	type Member = { id: string; name: string; photo: string };
	type DrawRound = { id: string; prize: string; winners: Member[]; createdAt: string };
	let { data } = $props<{ data: { members: Member[]; source: string } }>();

	const STORAGE_KEY = 'lctech-lottery-state-v2';
	const allMembers = [...data.members];

	let remaining = $state<Member[]>([...allMembers]);
	let rounds = $state<DrawRound[]>([]);
	let drawCount = $state(1);
	let prizeName = $state('');
	let currentName = $state('準備抽獎');
	let currentPhoto = $state('');
	let drawing = $state(false);
	let message = $state('');
	let staged = $state<Member[]>([]);

	function persist() {
		if (!browser) return;
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				remaining: remaining.map((r) => r.id),
				rounds: rounds.map((r) => ({
					id: r.id,
					prize: r.prize,
					createdAt: r.createdAt,
					winnerIds: r.winners.map((w) => w.id)
				}))
			})
		);
	}

	onMount(() => {
		if (!browser || allMembers.length === 0) return;
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		try {
			const saved = JSON.parse(raw) as {
				remaining: string[];
				rounds: Array<{ id: string; prize: string; createdAt: string; winnerIds: string[] }>;
			};
			const map = new Map(allMembers.map((m) => [m.id, m]));
			remaining = (saved.remaining ?? []).map((id) => map.get(id)).filter(Boolean) as Member[];
			rounds = (saved.rounds ?? [])
				.map((r) => ({
					id: r.id,
					prize: r.prize,
					createdAt: r.createdAt,
					winners: (r.winnerIds ?? []).map((id) => map.get(id)).filter(Boolean) as Member[]
				}))
				.filter((r) => r.winners.length > 0);
		} catch {
			// ignore
		}
	});

	function randomMember(pool: Member[]) {
		const idx = Math.floor(Math.random() * pool.length);
		return pool[idx];
	}

	function sleep(ms: number) {
		return new Promise((r) => setTimeout(r, ms));
	}

	async function spinAndPick(pool: Member[]) {
		const spinMs = 1100;
		const timer = setInterval(() => {
			const m = randomMember(pool);
			currentName = m?.name ?? '抽獎中...';
			currentPhoto = m?.photo ?? '';
		}, 55);
		await sleep(spinMs);
		clearInterval(timer);
		const winner = randomMember(pool);
		currentName = winner.name;
		currentPhoto = winner.photo;
		return winner;
	}

	async function runDraw() {
		if (drawing || remaining.length === 0) return;
		drawing = true;
		message = '';
		staged = [];

		const want = Math.max(1, Math.floor(drawCount || 1));
		const count = Math.min(want, remaining.length);
		const pool = [...remaining];
		const picked: Member[] = [];

		for (let i = 0; i < count; i++) {
			const winner = await spinAndPick(pool);
			picked.push(winner);
			staged = [...picked];
			const idx = pool.findIndex((m) => m.id === winner.id);
			if (idx >= 0) pool.splice(idx, 1);
			await sleep(380);
		}

		const pickedIds = new Set(picked.map((p) => p.id));
		remaining = remaining.filter((m) => !pickedIds.has(m.id));
		const prize = prizeName.trim() || `第 ${rounds.length + 1} 輪`;
		rounds = [
			{ id: crypto.randomUUID(), prize, winners: picked, createdAt: new Date().toISOString() },
			...rounds
		];
		message = `${prize} 抽出 ${picked.length} 位`;
		prizeName = '';
		drawing = false;
		persist();
	}

	function clearOne(roundId: string, memberId: string) {
		const round = rounds.find((r) => r.id === roundId);
		if (!round) return;
		const target = round.winners.find((w) => w.id === memberId);
		if (!target) return;

		round.winners = round.winners.filter((w) => w.id !== memberId);
		rounds = rounds.filter((r) => r.winners.length > 0);
		remaining = [...remaining, target];
		persist();
	}

	function clearRound(roundId: string) {
		const round = rounds.find((r) => r.id === roundId);
		if (!round) return;
		remaining = [...remaining, ...round.winners];
		rounds = rounds.filter((r) => r.id !== roundId);
		persist();
	}

	function clearAll() {
		remaining = [...allMembers];
		rounds = [];
		staged = [];
		currentName = '準備抽獎';
		currentPhoto = '';
		message = '已清除全部得獎名單';
		persist();
	}
</script>

<main class="casino-bg">
	<div class="bg-glow bg-glow-a"></div>
	<div class="bg-glow bg-glow-b"></div>
	<section class="card">
		<h1>
			<span class="title-icon" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none">
					<path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="1.8"/>
					<path d="M8 10h8M8 14h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
					<circle cx="18" cy="12" r="2.2" fill="currentColor"/>
				</svg>
			</span>
			LC TECH 抽獎機
		</h1>
		<p class="source">名單來源：<a href={data.source} target="_blank" rel="noreferrer">team.php</a></p>

		<div class="display" class:drawing={drawing}>
			<div class="avatar-wrap">
				{#if currentPhoto}
					<img src={currentPhoto} alt={currentName} class="avatar" />
				{:else}
					<div class="avatar placeholder">?</div>
				{/if}
			</div>
			<div>
				<div class="label">目前顯示</div>
				<div class="name">{currentName}</div>
			</div>
		</div>

		{#if staged.length > 0}
			<div class="staged">
				<strong>逐位停下結果：</strong>
				<div class="chips">
					{#each staged as s}
						<span>{s.name}</span>
					{/each}
				</div>
			</div>
		{/if}

		<div class="controls">
			<label>
				獎項名稱
				<input type="text" bind:value={prizeName} placeholder="例如：特獎 / 二獎" />
			</label>
			<label>
				連續抽獎數量
				<input type="number" min="1" bind:value={drawCount} />
			</label>
			<button onclick={runDraw} disabled={drawing || remaining.length === 0}>
				<svg class="btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M8 6l10 6-10 6V6z" fill="currentColor"/>
				</svg>
				開始抽獎
			</button>
		</div>

		{#if message}
			<p class="msg">{message}</p>
		{/if}

		<div class="stats">
			<span>可抽名單：{remaining.length}</span>
			<span>已中獎：{rounds.reduce((s, r) => s + r.winners.length, 0)}</span>
		</div>
	</section>

	<section class="card winners">
		<div class="winner-header">
			<h2>
				<span class="title-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" fill="none">
						<path d="M7 5h10v3a5 5 0 0 1-10 0V5z" stroke="currentColor" stroke-width="1.8"/>
						<path d="M9 17h6M10 14h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
						<path d="M5 7H3a2 2 0 0 0 2 3M19 7h2a2 2 0 0 1-2 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
					</svg>
				</span>
				得獎區塊（依抽獎輪次 / 獎項）
			</h2>
			<button class="danger" onclick={clearAll} disabled={rounds.length === 0}>全部清除</button>
		</div>

		{#if rounds.length === 0}
			<p class="empty">尚未抽出得獎者</p>
		{:else}
			<div class="rounds">
				{#each rounds as round (round.id)}
					<div class="round">
						<div class="round-head">
							<h3>{round.prize}</h3>
							<button class="small danger" onclick={() => clearRound(round.id)}>清除此獎項</button>
						</div>
						<ul>
							{#each round.winners as winner, i (winner.id)}
								<li>
									<div class="winner-left">
										{#if winner.photo}
											<img src={winner.photo} alt={winner.name} class="mini" />
										{:else}
											<div class="mini placeholder">?</div>
										{/if}
										<span>#{i + 1} {winner.name}</span>
									</div>
									<button class="small" onclick={() => clearOne(round.id, winner.id)}>單一清除</button>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
		background:
			radial-gradient(circle at 20% 10%, rgba(255, 80, 80, 0.16), transparent 30%),
			radial-gradient(circle at 80% 20%, rgba(255, 215, 120, 0.12), transparent 28%),
			linear-gradient(180deg, #2a0606 0%, #120404 60%, #090202 100%);
		color: #f8e7b5;
	}
	.casino-bg {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		min-height: 100vh;
		padding: 2rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1.2fr 1fr;
	}
	.bg-glow { position: absolute; border-radius: 999px; filter: blur(40px); z-index: -1; }
	.bg-glow-a { width: 340px; height: 340px; background: rgba(255, 70, 70, 0.22); top: -80px; left: -70px; }
	.bg-glow-b { width: 280px; height: 280px; background: rgba(255, 205, 92, 0.18); bottom: -70px; right: -60px; }
	.card {
		backdrop-filter: blur(3px);
		background: linear-gradient(160deg, rgba(48, 0, 0, 0.76), rgba(12, 12, 12, 0.88));
		border: 1px solid rgba(255, 214, 118, 0.72);
		border-radius: 18px;
		padding: 1.2rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.38), inset 0 0 0 1px rgba(255, 226, 150, 0.15);
	}
	h1,h2,h3 { margin: 0 0 .5rem 0; color: #ffd86b; letter-spacing: .3px; display:flex; align-items:center; gap:.5rem; }
	.title-icon { width: 1.15em; height: 1.15em; display:inline-flex; color:#ffdf83; filter: drop-shadow(0 0 6px rgba(255,216,107,.45)); }
	.title-icon svg { width:100%; height:100%; }
	.source { margin: 0 0 1rem; font-size: .9rem; opacity: .9; }
	.source a { color: #ffd86b; }
	.display {
		padding: 1rem;
		border-radius: 14px;
		background: linear-gradient(180deg, rgba(24, 12, 12, 0.96), rgba(31, 16, 16, 0.86));
		border: 1px solid rgba(255, 208, 100, 0.5);
		margin-bottom: 1rem;
		display: flex;
		gap: 1rem;
		align-items: center;
		box-shadow: inset 0 0 25px rgba(255, 171, 49, 0.1);
	}
	.display.drawing .name { animation: flicker .08s infinite alternate; text-shadow: 0 0 10px rgba(255, 219, 131, 0.8); }
	.avatar-wrap { width: 78px; }
	.avatar {
		width: 82px;
		height: 82px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #ffd86b;
		box-shadow: 0 0 0 3px rgba(255, 216, 107, 0.2), 0 0 18px rgba(255, 205, 92, 0.45);
	}
	.avatar.placeholder, .mini.placeholder { display:flex; align-items:center; justify-content:center; background:#2a1919; color:#ffd86b; font-weight:700; }
	.label { font-size: .85rem; opacity: .8; }
	.name { font-size: 2rem; font-weight: 700; min-height: 3rem; }
	.controls { display: flex; gap: .8rem; align-items: end; flex-wrap: wrap; }
	input { width: 170px; padding: .45rem; border-radius: 8px; border: 1px solid #d4af37; background: #2a1919; color: #fff; }
	input[type='number'] { width: 90px; }
	button {
		display: inline-flex;
		align-items: center;
		gap: .4rem;
		padding: .55rem .95rem;
		border: 0;
		border-radius: 10px;
		background: linear-gradient(180deg, #ffe49a, #d4951c);
		color: #1d1201;
		font-weight: 800;
		cursor: pointer;
		transition: transform .12s ease, filter .12s ease, box-shadow .12s ease;
		box-shadow: 0 4px 12px rgba(212, 135, 17, 0.35);
	}
	button:hover { transform: translateY(-1px); filter: brightness(1.04); }
	button:active { transform: translateY(0); }
	button:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
	button.danger { background: linear-gradient(180deg, #ff8b8b, #c02b2b); color: #fff; }
	button.small { padding: .35rem .65rem; font-size: .85rem; }
	.btn-icon { width: 1em; height: 1em; }
	.stats { display: flex; gap: 1rem; margin-top: 1rem; opacity: .95; }
	.msg { color: #ffe9a3; margin: .75rem 0 0; }
	.staged { margin-bottom: .8rem; }
	.chips { display: flex; gap: .4rem; flex-wrap: wrap; margin-top: .4rem; }
	.chips span { background: #3f2400; border: 1px solid #d4af37; padding: .2rem .45rem; border-radius: 999px; }
	.winner-header { display: flex; justify-content: space-between; align-items: center; }
	.rounds { display: grid; gap: .8rem; margin-top: .6rem; max-height: 70vh; overflow: auto; }
	.round {
		border: 1px solid rgba(255, 216, 107, 0.35);
		border-radius: 12px;
		padding: .65rem;
		background: linear-gradient(180deg, rgba(0,0,0,.2), rgba(38, 14, 14, .24));
		box-shadow: inset 0 0 0 1px rgba(255, 226, 150, 0.08);
	}
	.round-head { display: flex; justify-content: space-between; align-items: center; }
	ul { list-style: none; padding: 0; margin: .4rem 0 0; }
	li { display: flex; justify-content: space-between; align-items: center; padding: .45rem .2rem; border-bottom: 1px solid rgba(255,216,107,.15); }
	.winner-left { display:flex; align-items:center; gap:.55rem; }
	.mini { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid #d4af37; }
	.empty { opacity: .8; }
	@keyframes flicker { from { opacity: .7; transform: scale(.99);} to {opacity:1; transform: scale(1.01);} }
	@media (max-width: 900px) { .casino-bg { grid-template-columns: 1fr; padding: 1rem; } .name { font-size: 1.4rem; min-height: auto; } }
</style>
