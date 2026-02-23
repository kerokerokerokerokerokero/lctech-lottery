<svelte:head>
	<title>LCQM｜AI 工作流助手提案</title>
</svelte:head>

<main>
	<section class="hero">
		<div class="hero-badge">LCQM 2026</div>
		<h1>AI 工作流助手原型</h1>
		<p class="subtitle">跨 GitHub + Figma 的 24 小時協作系統，讓團隊白天做決策、晚上持續推進。</p>
		<div class="chips">
			<span>🤖 24/7 AI</span>
			<span>🐙 GitHub</span>
			<span>🎨 Figma</span>
			<span>📣 自動派工</span>
		</div>
	</section>

	<section class="card question">
		<h2>題目</h2>
		<blockquote>
			「如果你有一位 24 小時不休息的 AI 助手，它該如何幫助你的部門提升產出？請利用現有的 AI
			工具（如 ChatGPT、Claude 或企業內部 AI），設計一個具體的『工作流助手』原型，解決一個具體的工作問題。」
		</blockquote>
	</section>

	<section class="grid two">
		<article class="card">
			<h3>🎯 要解決的問題</h3>
			<p>
				產品、設計、工程之間的任務同步常有時差：需求改了沒人跟上、派工不精準、下班後進度停擺，導致隔天要花大量時間重新對齊。
			</p>
		</article>
		<article class="card">
			<h3>💡 原型概念</h3>
			<p>
				建立 AI Workflow Assistant，串接 GitHub 與 Figma，持續監控變更、產生任務、智慧派工，並在非上班時間自動進行測試與建議整理。
			</p>
		</article>
	</section>

	<section class="card">
		<h2>工作流程（Prototype Flow）</h2>
		<div class="flow">
			<div class="step">
				<div class="icon">👀</div>
				<div>
					<h4>1) 事件監控</h4>
					<p>24/7 監控 GitHub（PR / Issue / Commit / CI）與 Figma（設計更新、註解、版本差異）。</p>
				</div>
			</div>
			<div class="step">
				<div class="icon">🧩</div>
				<div>
					<h4>2) 任務生成</h4>
					<p>自動轉成可執行 task：需求摘要、影響範圍、驗收條件、優先級。</p>
				</div>
			</div>
			<div class="step">
				<div class="icon">🧠</div>
				<div>
					<h4>3) 智慧派工</h4>
					<p>依角色、技能、負載與優先度，建議最適合負責人並通知。</p>
				</div>
			</div>
			<div class="step">
				<div class="icon">🌙</div>
				<div>
					<h4>4) 下班後持續推進</h4>
					<p>依當日進度自動跑測試、檢查風險、產生改善建議與待辦清單。</p>
				</div>
			</div>
			<div class="step">
				<div class="icon">🌅</div>
				<div>
					<h4>5) 隔日交接</h4>
					<p>早上輸出 Daily Brief（昨日進度、阻塞點、建議下一步），團隊可直接接續。</p>
				</div>
			</div>
		</div>
	</section>

	<section class="grid two">
		<article class="card">
			<h3>🛠️ 使用工具</h3>
			<ul>
				<li>GitHub（Issue / PR / Actions / Webhook）</li>
				<li>Figma（File / Comment API 或 Plugin 事件）</li>
				<li>ChatGPT / Claude / 企業內部 LLM（摘要、拆解、建議）</li>
				<li>Slack / Discord / Email（派工通知與每日報告）</li>
			</ul>
		</article>
		<article class="card kpi">
			<h3>📈 預期效益（KPI）</h3>
			<ul>
				<li><strong>-50%</strong> 需求到派工時間</li>
				<li><strong>-30%</strong> 隔日 standup 對齊時間</li>
				<li><strong>↑</strong> 夜間風險提前發現率</li>
				<li><strong>↑</strong> 跨部門資訊同步效率</li>
			</ul>
		</article>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: Inter, "Noto Sans TC", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
		line-height: 1.7;
		background:
			radial-gradient(circle at 10% -10%, #8b5cf633 0%, transparent 35%),
			radial-gradient(circle at 100% 0%, #06b6d433 0%, transparent 30%),
			#0b1020;
		color: #e5e7eb;
	}

	main {
		max-width: 980px;
		margin: 0 auto;
		padding: 2.25rem 1.1rem 3.5rem;
	}

	.hero {
		background: linear-gradient(135deg, #111827, #1f2937);
		border: 1px solid #ffffff1f;
		border-radius: 18px;
		padding: 1.25rem;
		box-shadow: 0 16px 40px #00000040;
	}

	.hero-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #22c55e26;
		border: 1px solid #22c55e5e;
		color: #bbf7d0;
		font-size: 0.8rem;
	}

	h1 {
		margin: 0.45rem 0 0;
		font-size: clamp(2rem, 7vw, 3rem);
	}

	.subtitle {
		margin: 0.5rem 0 0;
		opacity: 0.92;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.8rem;
	}

	.chips span {
		font-size: 0.88rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #ffffff12;
		border: 1px solid #ffffff24;
	}

	.grid {
		display: grid;
		gap: 0.95rem;
		margin-top: 0.95rem;
	}

	.grid.two {
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.card {
		margin-top: 0.95rem;
		padding: 1rem 1.05rem;
		background: #111827cc;
		border: 1px solid #ffffff1a;
		border-radius: 14px;
	}

	.card :is(h2, h3) {
		margin: 0 0 0.35rem;
	}

	.question blockquote {
		margin: 0;
		padding-left: 0.85rem;
		border-left: 4px solid #60a5fa;
		color: #dbeafe;
	}

	.flow {
		display: grid;
		gap: 0.65rem;
	}

	.step {
		display: grid;
		grid-template-columns: 2rem 1fr;
		gap: 0.6rem;
		padding: 0.65rem;
		border-radius: 10px;
		background: #ffffff0d;
		border: 1px solid #ffffff14;
	}

	.icon {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: #38bdf826;
	}

	h4 {
		margin: 0;
		font-size: 1rem;
	}

	p,
	li {
		margin: 0.28rem 0;
	}

	ul {
		margin: 0;
		padding-left: 1.15rem;
	}

	.kpi strong {
		color: #86efac;
	}
</style>
