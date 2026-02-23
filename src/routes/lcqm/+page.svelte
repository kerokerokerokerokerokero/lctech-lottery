<svelte:head>
	<title>FlowPilot｜LCQM AI 工作流助手</title>
	<meta
		name="description"
		content="FlowPilot 是一個串接 GitHub 與 Figma 的 AI 工作流助手，24 小時自動監控、拆解任務、智慧派工，讓團隊隔天直接接手。"
	/>
</svelte:head>

<main>
	<header class="nav">
		<div class="logo">⚡ FlowPilot</div>
		<nav>
			<a href="#features">功能</a>
			<a href="#workflow">流程</a>
			<a href="#kpi">效益</a>
		</nav>
	</header>

	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow">LCQM 2026 提案</p>
			<h1>讓 AI 成為你們團隊的<br />24/7 工作流助手</h1>
			<p class="lead">
				串接 GitHub + Figma，自動追蹤變更、產生任務、派工到對的人，並在下班後持續測試與整理建議，讓隔天的開工效率直接拉滿。
			</p>
			<div class="hero-cta">
				<a class="btn primary" href="#workflow">查看工作流程</a>
				<a class="btn ghost" href="#features">探索功能</a>
			</div>
		</div>
		<div class="hero-panel">
			<h3>今晚 AI 正在做的事</h3>
			<ul>
				<li>👀 監控 PR 與 Figma 設計差異</li>
				<li>🧩 生成可執行 task 與驗收條件</li>
				<li>🧠 建議最適合負責人與優先級</li>
				<li>🧪 自動跑測試並產出風險報告</li>
				<li>🌅 早上輸出 Daily Brief</li>
			</ul>
		</div>
	</section>

	<section id="features" class="section">
		<div class="section-head">
			<p class="eyebrow">核心功能</p>
			<h2>像產品一樣可落地的 AI 能力組合</h2>
		</div>
		<div class="cards four">
			<article class="card">
				<div class="icon">🐙</div>
				<h3>GitHub 即時監控</h3>
				<p>PR / Issue / Commit / CI 事件即時彙整，免手動追進度。</p>
			</article>
			<article class="card">
				<div class="icon">🎨</div>
				<h3>Figma 變更偵測</h3>
				<p>設計稿版本、註解與差異追蹤，自動連動需求調整。</p>
			</article>
			<article class="card">
				<div class="icon">🧩</div>
				<h3>任務自動拆解</h3>
				<p>生成任務描述、影響範圍、驗收標準與優先順序。</p>
			</article>
			<article class="card">
				<div class="icon">📣</div>
				<h3>智慧派工通知</h3>
				<p>依技能、負載與緊急度分配給最適人選，並自動通知。</p>
			</article>
		</div>
	</section>

	<section id="workflow" class="section workflow">
		<div class="section-head">
			<p class="eyebrow">運作流程</p>
			<h2>從變更發生到隔日交接，一條龍自動化</h2>
		</div>

		<ol>
			<li>
				<span>1</span>
				<div>
					<h4>事件收集</h4>
					<p>監控 GitHub 與 Figma 的所有關鍵變更。</p>
				</div>
			</li>
			<li>
				<span>2</span>
				<div>
					<h4>任務生成</h4>
					<p>轉為可執行 task，附上驗收條件與依賴關係。</p>
				</div>
			</li>
			<li>
				<span>3</span>
				<div>
					<h4>派工與同步</h4>
					<p>AI 提出負責人建議並同步到 Slack / Discord / Email。</p>
				</div>
			</li>
			<li>
				<span>4</span>
				<div>
					<h4>夜間推進</h4>
					<p>下班後自動測試、風險掃描、整理改善建議。</p>
				</div>
			</li>
			<li>
				<span>5</span>
				<div>
					<h4>晨間交接</h4>
					<p>輸出 Daily Brief，團隊一上班就能直接接續。</p>
				</div>
			</li>
		</ol>
	</section>

	<section id="kpi" class="section">
		<div class="section-head">
			<p class="eyebrow">商業價值</p>
			<h2>可衡量的產出提升</h2>
		</div>
		<div class="cards three stats">
			<article class="card stat">
				<p class="value">-50%</p>
				<p class="label">需求到派工時間</p>
			</article>
			<article class="card stat">
				<p class="value">-30%</p>
				<p class="label">隔日 standup 對齊時間</p>
			</article>
			<article class="card stat">
				<p class="value">↑</p>
				<p class="label">夜間風險提前發現率</p>
			</article>
		</div>
	</section>

	<section class="cta">
		<h2>把 AI 從聊天工具，升級成你們的生產力基礎設施</h2>
		<p>FlowPilot：白天協作、晚上推進、隔天直上。</p>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: Inter, 'Noto Sans TC', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
		background:
			radial-gradient(1200px 500px at 10% -10%, #60a5fa33 0%, transparent 60%),
			radial-gradient(900px 450px at 100% 0%, #a78bfa33 0%, transparent 55%),
			#070b14;
		color: #e5e7eb;
	}

	main {
		max-width: 1060px;
		margin: 0 auto;
		padding: 1.1rem 1.1rem 3.5rem;
	}

	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		margin-bottom: 1rem;
	}

	.logo {
		font-weight: 800;
		letter-spacing: 0.2px;
	}

	nav {
		display: flex;
		gap: 0.9rem;
	}

	nav a {
		color: #cbd5e1;
		text-decoration: none;
		font-size: 0.95rem;
	}

	.hero {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 1rem;
		padding: 1.3rem;
		border-radius: 20px;
		background: linear-gradient(140deg, #0b1220, #151b2f);
		border: 1px solid #ffffff1a;
		box-shadow: 0 24px 50px #00000044;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #93c5fd;
	}

	h1 {
		margin: 0.45rem 0 0;
		font-size: clamp(2rem, 6vw, 3.3rem);
		line-height: 1.15;
	}

	.lead {
		margin-top: 0.7rem;
		font-size: 1.03rem;
		color: #cbd5e1;
	}

	.hero-cta {
		display: flex;
		gap: 0.6rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.52rem 0.95rem;
		border-radius: 10px;
		text-decoration: none;
		font-weight: 650;
		font-size: 0.93rem;
	}

	.btn.primary {
		background: linear-gradient(90deg, #38bdf8, #818cf8);
		color: #0b1020;
	}

	.btn.ghost {
		border: 1px solid #ffffff33;
		color: #e2e8f0;
	}

	.hero-panel {
		background: #ffffff0d;
		border: 1px solid #ffffff1f;
		border-radius: 14px;
		padding: 0.95rem;
	}

	.hero-panel h3 {
		margin: 0 0 0.3rem;
	}

	.hero-panel ul {
		margin: 0;
		padding-left: 1.1rem;
	}

	.section {
		margin-top: 1.1rem;
	}

	.section-head h2 {
		margin: 0.25rem 0 0;
		font-size: clamp(1.35rem, 3.6vw, 2rem);
	}

	.cards {
		display: grid;
		gap: 0.8rem;
		margin-top: 0.8rem;
	}

	.cards.four {
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
	}

	.cards.three {
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
	}

	.card {
		background: #0f172acc;
		border: 1px solid #ffffff1f;
		border-radius: 14px;
		padding: 0.9rem;
	}

	.icon {
		display: inline-grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: #38bdf833;
		margin-bottom: 0.35rem;
	}

	.card h3 {
		margin: 0.2rem 0;
		font-size: 1.03rem;
	}

	.card p {
		margin: 0;
		color: #cbd5e1;
	}

	.workflow ol {
		list-style: none;
		margin: 0.9rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.6rem;
	}

	.workflow li {
		display: grid;
		grid-template-columns: 2rem 1fr;
		gap: 0.6rem;
		padding: 0.75rem;
		background: #0f172acc;
		border: 1px solid #ffffff1f;
		border-radius: 12px;
	}

	.workflow span {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		font-weight: 800;
		background: linear-gradient(135deg, #22d3ee, #818cf8);
		color: #0b1020;
	}

	h4 {
		margin: 0;
	}

	.workflow li p {
		margin: 0.1rem 0 0;
	}

	.stats .stat {
		text-align: center;
	}

	.value {
		margin: 0;
		font-size: 2rem;
		font-weight: 900;
		color: #86efac;
	}

	.label {
		margin: 0.2rem 0 0;
		color: #cbd5e1;
	}

	.cta {
		margin-top: 1.2rem;
		padding: 1.2rem;
		text-align: center;
		border-radius: 16px;
		background: linear-gradient(120deg, #06b6d433, #8b5cf633);
		border: 1px solid #ffffff29;
	}

	.cta h2 {
		margin: 0;
	}

	.cta p {
		margin: 0.35rem 0 0;
		color: #dbeafe;
	}

	@media (max-width: 840px) {
		.nav {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.45rem;
		}

		.hero {
			grid-template-columns: 1fr;
		}
	}
</style>
