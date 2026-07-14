import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const libsql = { url: `file:${dbPath}` };
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const hash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@ai-media.jp" },
    update: {},
    create: { email: "admin@ai-media.jp", password: hash, name: "管理者", role: "admin" },
  });

  const categories = [
    { name: "ChatGPT活用術", slug: "chatgpt", description: "ChatGPTの使い方・プロンプト・活用事例", color: "#10b981" },
    { name: "AI業務効率化", slug: "ai-business", description: "AIを使った業務効率化・自動化の方法", color: "#6366f1" },
    { name: "AIツール比較", slug: "ai-tools", description: "各種AIツールのレビューと比較", color: "#f59e0b" },
    { name: "プロンプトエンジニアリング", slug: "prompt", description: "効果的なプロンプトの書き方", color: "#ef4444" },
    { name: "AI副業・収益化", slug: "ai-income", description: "AIを活用した副業・収益化の方法", color: "#8b5cf6" },
    { name: "AI最新ニュース", slug: "ai-news", description: "AI業界の最新情報・トレンド", color: "#06b6d4" },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const tags = [
    "ChatGPT", "Claude", "Gemini", "Copilot", "Midjourney",
    "プロンプト", "自動化", "副業", "生産性向上", "ビジネス活用", "初心者向け",
    "SEO", "ライティング", "画像生成", "コーディング", "マーケティング",
  ];
  for (const t of tags) {
    const slug = Buffer.from(t).toString("base64").replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0,20) + "-" + Math.random().toString(36).slice(2,7);
    await prisma.tag.upsert({ where: { name: t }, update: {}, create: { name: t, slug } });
  }

  const keywords = [
    { keyword: "ChatGPT 使い方 初心者", searchVolume: 45000, difficulty: 45, priority: "high", category: "ChatGPT活用術" },
    { keyword: "Claude AI 使い方", searchVolume: 22000, difficulty: 35, priority: "high", category: "AIツール比較" },
    { keyword: "プロンプトエンジニアリング 入門", searchVolume: 18000, difficulty: 40, priority: "high", category: "プロンプトエンジニアリング" },
    { keyword: "AI 業務効率化 具体例", searchVolume: 15000, difficulty: 42, priority: "high", category: "AI業務効率化" },
    { keyword: "ChatGPT プロンプト コピペ", searchVolume: 35000, difficulty: 30, priority: "high", category: "プロンプトエンジニアリング" },
    { keyword: "AI 副業 稼ぎ方", searchVolume: 28000, difficulty: 55, priority: "high", category: "AI副業・収益化" },
    { keyword: "Midjourney 使い方 日本語", searchVolume: 20000, difficulty: 38, priority: "medium", category: "AIツール比較" },
    { keyword: "ChatGPT 仕事 活用", searchVolume: 25000, difficulty: 48, priority: "high", category: "AI業務効率化" },
    { keyword: "GPT-4o 使い方", searchVolume: 16000, difficulty: 32, priority: "high", category: "ChatGPT活用術" },
    { keyword: "Copilot 使い方 Office", searchVolume: 19000, difficulty: 36, priority: "high", category: "AI業務効率化" },
    { keyword: "AI 画像生成 無料", searchVolume: 31000, difficulty: 45, priority: "high", category: "AIツール比較" },
    { keyword: "Claude 3.5 Sonnet 使い方", searchVolume: 9000, difficulty: 28, priority: "high", category: "AIツール比較" },
    { keyword: "AI ブログ 書き方", searchVolume: 14000, difficulty: 42, priority: "high", category: "AI副業・収益化" },
    { keyword: "Gemini AI 使い方", searchVolume: 24000, difficulty: 40, priority: "high", category: "AIツール比較" },
    { keyword: "生成AI ビジネス活用 事例", searchVolume: 13000, difficulty: 44, priority: "high", category: "AI業務効率化" },
    { keyword: "AI SEO 対策", searchVolume: 7800, difficulty: 50, priority: "medium", category: "AI副業・収益化" },
    { keyword: "ChatGPT 文章 作成", searchVolume: 21000, difficulty: 38, priority: "high", category: "ChatGPT活用術" },
    { keyword: "AI 自動化 ビジネス", searchVolume: 11000, difficulty: 45, priority: "medium", category: "AI業務効率化" },
    { keyword: "プロンプト テンプレート 無料", searchVolume: 17000, difficulty: 33, priority: "high", category: "プロンプトエンジニアリング" },
    { keyword: "AI ツール 比較 2026", searchVolume: 23000, difficulty: 42, priority: "high", category: "AIツール比較" },
  ];
  for (const kw of keywords) {
    await prisma.keyword.upsert({ where: { keyword: kw.keyword }, update: {}, create: { ...kw, status: "pending" } });
  }

  const affiliates = [
    { name: "ChatGPT Plus", url: "https://chat.openai.com", commission: "月次報酬あり", category: "AIサービス", description: "OpenAIの有料プランGPT-4o無制限利用" },
    { name: "Claude Pro", url: "https://claude.ai", commission: "月次報酬あり", category: "AIサービス", description: "AnthropicのClaude AIプレミアムプラン" },
    { name: "Perplexity Pro", url: "https://perplexity.ai", commission: "20%", category: "AIサービス", description: "AI検索エンジンのプロプラン" },
    { name: "Notion AI", url: "https://notion.so", commission: "15%", category: "生産性ツール", description: "Notionに組み込まれたAIアシスタント" },
    { name: "Midjourney", url: "https://midjourney.com", commission: "月次報酬", category: "AI画像生成", description: "最高品質のAI画像生成ツール" },
    { name: "Jasper AI", url: "https://jasper.ai", commission: "25%", category: "AIライティング", description: "マーケター向けAIライティングツール" },
    { name: "Runway ML", url: "https://runwayml.com", commission: "20%", category: "AI動画生成", description: "AI動画生成・編集プラットフォーム" },
    { name: "Copy.ai", url: "https://copy.ai", commission: "30%", category: "AIライティング", description: "AI搭載コピーライティングツール" },
  ];
  for (const aff of affiliates) {
    await prisma.affiliateProduct.upsert({ where: { name: aff.name }, update: {}, create: aff });
  }

  const adSlots = [
    { name: "ヘッダー広告", position: "header", adCode: "<!-- Google AdSense Header -->", revenue: 12500 },
    { name: "記事内広告（上部）", position: "content-top", adCode: "<!-- Google AdSense Content Top -->", revenue: 8300 },
    { name: "記事内広告（中部）", position: "content-mid", adCode: "<!-- Google AdSense Content Mid -->", revenue: 6700 },
    { name: "サイドバー広告", position: "sidebar", adCode: "<!-- Google AdSense Sidebar -->", revenue: 4200 },
    { name: "フッター広告", position: "footer", adCode: "<!-- Google AdSense Footer -->", revenue: 2100 },
  ];
  for (const slot of adSlots) {
    await prisma.adSlot.create({ data: slot }).catch(() => {});
  }

  const settings = [
    { key: "site_name", value: "AI活用ラボ", description: "サイト名" },
    { key: "site_description", value: "最新AIツールの使い方・活用事例・副業情報を毎日お届け", description: "サイト説明" },
    { key: "site_url", value: "https://ai-media.jp", description: "サイトURL" },
    { key: "articles_per_day", value: "3", description: "1日の記事生成数" },
    { key: "auto_publish", value: "true", description: "自動公開を有効にする" },
    { key: "sns_auto_post", value: "false", description: "SNS自動投稿を有効にする" },
    { key: "target_pv", value: "100000", description: "目標月間PV数" },
    { key: "adsense_id", value: "", description: "Google AdSense Publisher ID" },
  ];
  for (const s of settings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  const cat = await prisma.category.findFirst({ where: { slug: "chatgpt" } });
  const cat2 = await prisma.category.findFirst({ where: { slug: "ai-tools" } });
  const cat3 = await prisma.category.findFirst({ where: { slug: "prompt" } });

  const sampleArticles = [
    {
      title: "ChatGPT完全ガイド2026｜初心者から上級者まで徹底解説",
      slug: "chatgpt-complete-guide-2026",
      excerpt: "ChatGPTの基本的な使い方から高度な活用技術まで、2026年最新版として徹底解説。ビジネス・副業・学習での活用例も豊富に紹介します。",
      content: `## ChatGPTとは？\n\nChatGPTはOpenAIが開発した対話型AIです。2022年の公開以来、世界中で1億人以上のユーザーに使用されています。\n\n## 基本的な使い方\n\n1. **アカウント登録**: chat.openai.comにアクセスしてアカウントを作成\n2. **プロンプトを入力**: 会話するように質問や指示を入力\n3. **回答を確認**: AIが生成した回答を確認・活用\n\n## ビジネス活用の具体例\n\n### 文書作成の効率化\n- 企画書・提案書の作成を80%短縮\n- メール文章の下書き生成\n- 議事録の要約・整理\n\n### プログラミング支援\n- コードのデバッグ・レビュー\n- 新機能の実装アイデア提案\n\n## まとめ\n\nChatGPTを活用することで業務効率を大幅に改善できます。まずは無料版から始めて、効果を実感したらPlusへのアップグレードを検討しましょう。`,
      seoTitle: "ChatGPT完全ガイド2026｜使い方・活用例・料金を初心者向けに解説",
      seoDescription: "ChatGPTの基本的な使い方から業務活用まで徹底解説。2026年最新の機能・料金・活用事例を初心者でもわかりやすく説明します。",
      seoKeywords: "ChatGPT,使い方,初心者,ビジネス活用,GPT-4o",
      status: "published" as const,
      publishedAt: new Date(),
      readingTime: 8,
      wordCount: 1200,
      aiGenerated: false,
      categoryId: cat?.id,
    },
    {
      title: "Claude AIの使い方完全解説｜ChatGPTとの違いも徹底比較",
      slug: "claude-ai-guide-vs-chatgpt",
      excerpt: "AnthropicのClaude AIの使い方を詳しく解説。ChatGPTとの性能比較、ビジネス活用のメリット、料金プランまで網羅的に紹介します。",
      content: `## Claude AIとは？\n\nClaude AIはAnthropicが開発した対話型AIです。安全性と正確性を重視した設計で、長文処理が得意な点が特徴です。\n\n## ChatGPTとの主な違い\n\n文脈長はClaudeが最大20万トークン、ChatGPTは最大12.8万トークン。安全性は両者とも高いですが、Claudeがより保守的な設計です。\n\n## ビジネスでの活用シーン\n\n### 長文ドキュメントの分析\nClaudeは大量のPDFや契約書を一度に読み込んで分析できます。\n\n### 高品質なコンテンツ作成\nSEO記事やマーケティングコピーの品質が非常に高く、修正が少なくて済みます。\n\n## Claude Proの料金と特典\n\n月額$20のClaude Proでは、Claude 3.5 Sonnetへの優先アクセスと拡張された使用制限が提供されます。`,
      seoTitle: "Claude AI使い方ガイド2026｜ChatGPTとの違い・料金・活用例を解説",
      seoDescription: "Anthropic Claude AIの詳しい使い方解説。ChatGPTとの性能比較、ビジネス活用のポイント、Claude Proの料金まで徹底解説します。",
      seoKeywords: "Claude AI,使い方,ChatGPT比較,Anthropic,Claude Pro",
      status: "published" as const,
      publishedAt: new Date(Date.now() - 86400000),
      readingTime: 6,
      wordCount: 900,
      aiGenerated: false,
      categoryId: cat2?.id,
    },
    {
      title: "プロンプトエンジニアリング入門｜AIの回答精度を10倍上げる技術",
      slug: "prompt-engineering-beginner-guide",
      excerpt: "プロンプトエンジニアリングの基礎から実践テクニックまで解説。ChatGPT・Claudeで使える効果的なプロンプトパターンを多数紹介します。",
      content: `## プロンプトエンジニアリングとは？\n\nプロンプトエンジニアリングは、AIに最適な指示を与えることでより良い出力を得る技術です。\n\n## 基本テクニック5選\n\n### 1. 役割を与える\n「あなたは10年以上の経験を持つマーケティング専門家です」のように役割を設定することで回答の質が上がります。\n\n### 2. 段階的に考えさせる\n「この問題を段階的に考えてください」と指示することで論理的な回答が得られます。\n\n### 3. フォーマットを指定する\n出力形式を具体的に指定することで使いやすい回答が得られます。\n\n### 4. 具体例を提示する\n良い例と悪い例を示すことで期待する出力の質が向上します。\n\n## まとめ\n\nプロンプトエンジニアリングは練習で上達します。まずは役割設定から始めてみましょう。`,
      seoTitle: "プロンプトエンジニアリング入門2026｜ChatGPTの回答精度を上げる技術",
      seoDescription: "プロンプトエンジニアリングの基礎テクニックを徹底解説。ChatGPT・Claudeで使える効果的なプロンプトパターンと実践例を紹介します。",
      seoKeywords: "プロンプトエンジニアリング,プロンプト,ChatGPT,テクニック,AI活用",
      status: "published" as const,
      publishedAt: new Date(Date.now() - 2 * 86400000),
      readingTime: 10,
      wordCount: 1500,
      aiGenerated: false,
      categoryId: cat3?.id,
    },
    {
      title: "AIで副業を始める方法2026｜月5万円稼ぐロードマップ",
      slug: "ai-side-job-guide-2026",
      excerpt: "AIツールを活用した副業の始め方を解説。ChatGPTやClaudeを使ってライティング・画像生成・コンサルティングで収入を得る方法をご紹介します。",
      content: `## AI副業の種類\n\n1. AIライティング代行（月3〜15万円）\n2. AI画像生成サービス（月2〜8万円）\n3. AIプロンプト販売（月1〜5万円）\n4. AIコンサルティング（時給5,000〜30,000円）\n\n## 初心者が始めやすいAI副業\n\n### AIライティング\n最も参入しやすいAI副業です。ChatGPTで記事の下書きを作成し、人間が編集・品質確認をする形で効率的に収益化できます。\n\n## まとめ\n\nAI副業は今が始め時です。スキルが定着する前に早めに参入することをおすすめします。`,
      seoTitle: "AIで副業を始める方法2026｜月5万円稼ぐロードマップ完全版",
      seoDescription: "AIツールを使った副業の始め方を徹底解説。ChatGPT・Claudeで月5万円を目指すロードマップを公開します。",
      seoKeywords: "AI,副業,稼ぎ方,ChatGPT,ライティング",
      status: "published" as const,
      publishedAt: new Date(Date.now() - 3 * 86400000),
      readingTime: 7,
      wordCount: 1100,
      aiGenerated: true,
      categoryId: cat?.id,
    },
    {
      title: "Gemini AIの使い方ガイド｜Google製AIの実力を徹底検証",
      slug: "gemini-ai-complete-guide",
      excerpt: "GoogleのGemini AIの使い方を詳しく解説。ChatGPT・Claudeとの比較、Google Workspaceとの連携方法、Gemini Advancedの特典まで紹介します。",
      content: `## Gemini AIとは？\n\nGemini AIはGoogleが開発したAIアシスタントです。Google検索・Gmail・Googleドライブなどとシームレスに連携できる点が最大の特徴です。\n\n## 主な特徴\n\n- Google サービスとの統合\n- リアルタイム情報へのアクセス\n- 多言語対応の精度が高い\n- 画像・動画・音声の分析が可能\n\n## 使い方\n\ngoogle.comからGeminiにアクセスし、Googleアカウントでログインするだけで利用開始できます。\n\n## まとめ\n\nGeminiはGoogle製品をよく使う方に特におすすめです。`,
      seoTitle: "Gemini AI使い方ガイド2026｜ChatGPTとの違い・Advancedの特典を解説",
      seoDescription: "Google Gemini AIの使い方を徹底解説。ChatGPTとの性能比較、Google Workspace連携、Gemini Advancedの料金・特典まで紹介します。",
      seoKeywords: "Gemini AI,使い方,Google,ChatGPT比較,Gemini Advanced",
      status: "published" as const,
      publishedAt: new Date(Date.now() - 4 * 86400000),
      readingTime: 6,
      wordCount: 950,
      aiGenerated: true,
      categoryId: cat2?.id,
    },
  ];

  for (const article of sampleArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  const articles = await prisma.article.findMany({ where: { status: "published" } });
  for (const article of articles) {
    const viewCount = Math.floor(Math.random() * 800) + 100;
    for (let i = 0; i < viewCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      await prisma.articleView.create({
        data: {
          articleId: article.id,
          referer: ["https://google.com", "https://twitter.com", "direct", "https://yahoo.co.jp"][Math.floor(Math.random() * 4)],
          viewedAt: new Date(Date.now() - daysAgo * 86400000),
        },
      });
    }
  }

  for (let i = 0; i < 30; i++) {
    await prisma.revenue.create({
      data: {
        type: ["adsense", "affiliate", "inquiry"][Math.floor(Math.random() * 3)],
        amount: Math.random() * 8000 + 200,
        date: new Date(Date.now() - i * 86400000),
        note: i % 7 === 0 ? "月次確定分" : undefined,
      },
    });
  }

  console.log("✅ シードデータ投入完了");
}

main().catch(console.error).finally(() => prisma.$disconnect());
