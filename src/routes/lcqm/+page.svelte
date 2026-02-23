<svelte:head>
	<title>LCQM｜AI 工作流助手提案</title>
</svelte:head>

<main>
	<h1>LCQM</h1>
	<h2>AI 工作流助手原型：跨 GitHub + Figma 的 24 小時協作系統</h2>

	<section>
		<h3>題目</h3>
		<blockquote>
			「如果你有一位 24 小時不休息的 AI 助手，它該如何幫助你的部門提升產出？請利用現有的 AI
			工具（如 ChatGPT、Claude 或企業內部 AI），設計一個具體的『工作流助手』原型，解決一個具體的工作問題。」
		</blockquote>
	</section>

	<section>
		<h3>我們要解決的問題</h3>
		<p>
			產品、設計、工程之間的任務同步常有時差：需求改了沒人跟上、派工不精準、下班後進度停擺，導致隔天要花大量時間重新對齊。
		</p>
	</section>

	<section>
		<h3>原型概念</h3>
		<p>
			建立一個 AI Workflow Assistant，串接 GitHub 與 Figma，持續監控變更、產生任務、智慧派工，並在非上班時間自動進行測試與建議整理。
		</p>
	</section>

	<section>
		<h3>工作流程（Prototype Flow）</h3>
		<ol>
			<li>
				<strong>事件監控：</strong> AI 24/7 監控 GitHub（PR、Issue、Commit、CI）與 Figma（設計稿更新、註解、版本差異）。
			</li>
			<li>
				<strong>任務生成：</strong> AI 自動把變更轉成可執行 task（需求摘要、影響範圍、驗收條件、優先級）。
			</li>
			<li>
				<strong>智慧派工：</strong> 根據成員角色、技能、目前負載與專案優先度，建議最合適負責人。
			</li>
			<li>
				<strong>下班後持續推進：</strong> 依當日 task 進度，自動跑測試、檢查風險、產生改善建議與待辦清單。
			</li>
			<li>
				<strong>隔日交接：</strong> 早上自動輸出 Daily Brief（昨日進度、阻塞點、建議下一步），團隊可直接接續處理。
			</li>
		</ol>
	</section>

	<section>
		<h3>使用工具</h3>
		<ul>
			<li>GitHub（Issue / PR / Actions / Webhook）</li>
			<li>Figma（File/Comment API 或 plugin 事件）</li>
			<li>ChatGPT / Claude / 企業內部 LLM（摘要、任務拆解、建議生成）</li>
			<li>Slack / Discord / Email（派工通知與每日報告）</li>
		</ul>
	</section>

	<section>
		<h3>預期效益（KPI）</h3>
		<ul>
			<li>需求到派工時間縮短（例如 -50%）</li>
			<li>隔日 standup 對齊時間下降（例如 -30%）</li>
			<li>夜間可先發現測試風險，降低回歸成本</li>
			<li>跨部門溝通更即時，減少資訊斷點</li>
		</ul>
	</section>
</main>

<style>
	:global(body) {
		font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
		line-height: 1.7;
	}

	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 3rem 1.25rem 4rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 6vw, 3rem);
	}

	h2 {
		margin-top: 0.5rem;
		font-size: clamp(1.05rem, 2.6vw, 1.4rem);
		opacity: 0.9;
		font-weight: 600;
	}

	section {
		margin-top: 1.4rem;
		padding: 1rem 1.1rem;
		border: 1px solid rgba(120, 120, 120, 0.2);
		border-radius: 12px;
		background: rgba(120, 120, 120, 0.05);
	}

	h3 {
		margin: 0 0 0.5rem;
	}

	blockquote {
		margin: 0;
		padding-left: 1rem;
		border-left: 4px solid rgba(120, 120, 120, 0.4);
		opacity: 0.95;
	}

	p,
	li {
		margin: 0.35rem 0;
	}

	ol,
	ul {
		padding-left: 1.25rem;
	}
</style>
