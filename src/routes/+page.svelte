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
	<section class="card">
		<h1>🎰 LC TECH 抽獎機</h1>
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
			<button onclick={runDraw} disabled={drawing || remaining.length === 0}>開始抽獎</button>
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
			<h2>得獎區塊（依抽獎輪次 / 獎項）</h2>
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
		background: radial-gradient(circle at top, #3b0a0a, #120404 60%);
		color: #f8e7b5;
	}
	.casino-bg { min-height: 100vh; padding: 2rem; display: grid; gap: 1rem; grid-template-columns: 1.2fr 1fr; }
	.card { background: linear-gradient(160deg, rgba(40,0,0,.85), rgba(10,10,10,.9)); border: 1px solid #d4af37; border-radius: 16px; padding: 1.2rem; box-shadow: 0 0 20px rgba(212,175,55,.25); }
	h1,h2,h3 { margin: 0 0 .5rem 0; color: #ffd86b; }
	.source { margin: 0 0 1rem; font-size: .9rem; opacity: .9; }
	.source a { color: #ffd86b; }
	.display { padding: 1rem; border-radius: 12px; background: #1f1010; border: 1px solid #7e5b13; margin-bottom: 1rem; display: flex; gap: 1rem; align-items: center; }
	.display.drawing .name { animation: flicker .08s infinite alternate; }
	.avatar-wrap { width: 78px; }
	.avatar { width: 78px; height: 78px; border-radius: 50%; object-fit: cover; border: 2px solid #d4af37; }
	.avatar.placeholder, .mini.placeholder { display:flex; align-items:center; justify-content:center; background:#2a1919; color:#ffd86b; font-weight:700; }
	.label { font-size: .85rem; opacity: .8; }
	.name { font-size: 2rem; font-weight: 700; min-height: 3rem; }
	.controls { display: flex; gap: .8rem; align-items: end; flex-wrap: wrap; }
	input { width: 170px; padding: .45rem; border-radius: 8px; border: 1px solid #d4af37; background: #2a1919; color: #fff; }
	input[type='number'] { width: 90px; }
	button { padding: .55rem .9rem; border: 0; border-radius: 10px; background: linear-gradient(180deg, #ffd86b, #c08711); color: #1d1201; font-weight: 700; cursor: pointer; }
	button:disabled { opacity: .45; cursor: not-allowed; }
	button.danger { background: linear-gradient(180deg, #ff8b8b, #c02b2b); color: #fff; }
	button.small { padding: .35rem .65rem; font-size: .85rem; }
	.stats { display: flex; gap: 1rem; margin-top: 1rem; opacity: .95; }
	.msg { color: #ffe9a3; margin: .75rem 0 0; }
	.staged { margin-bottom: .8rem; }
	.chips { display: flex; gap: .4rem; flex-wrap: wrap; margin-top: .4rem; }
	.chips span { background: #3f2400; border: 1px solid #d4af37; padding: .2rem .45rem; border-radius: 999px; }
	.winner-header { display: flex; justify-content: space-between; align-items: center; }
	.rounds { display: grid; gap: .8rem; margin-top: .6rem; max-height: 70vh; overflow: auto; }
	.round { border: 1px solid rgba(255,216,107,.35); border-radius: 12px; padding: .65rem; background: rgba(0,0,0,.2); }
	.round-head { display: flex; justify-content: space-between; align-items: center; }
	ul { list-style: none; padding: 0; margin: .4rem 0 0; }
	li { display: flex; justify-content: space-between; align-items: center; padding: .45rem .2rem; border-bottom: 1px solid rgba(255,216,107,.15); }
	.winner-left { display:flex; align-items:center; gap:.55rem; }
	.mini { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid #d4af37; }
	.empty { opacity: .8; }
	@keyframes flicker { from { opacity: .7; transform: scale(.99);} to {opacity:1; transform: scale(1.01);} }
	@media (max-width: 900px) { .casino-bg { grid-template-columns: 1fr; padding: 1rem; } .name { font-size: 1.4rem; min-height: auto; } }
</style>
