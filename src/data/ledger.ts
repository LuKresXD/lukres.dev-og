// Single source of truth for the ledger page. Copy is transcribed verbatim
// from the content extract (lukres-content-extract/source-verbatim).

export type Receipt = { label: string; url: string };

export const receipts: Receipt[] = [
    { label: "1st @ MakeMIT × Harvard 2026", url: "https://devpost.com/software/smart-bin-z83asr" },
    { label: "1st @ SCBC 2026 · Solana track", url: "https://devfolio.co/projects/senthos-f3fb" },
    { label: "YC S26 · top 10% of applicants", url: "https://veto.tools" },
    { label: "$152k processed · AutoStickers", url: "https://t.me/Auto_Stickers_bot" },
];

export type WorkEntry = {
    org: string;
    role: string;
    period: string;
    summary: string;
    url: string;
};

export const work: WorkEntry[] = [
    {
        org: "Veto",
        role: "Co-Founder & Lead Engineer",
        period: "MAR 2026 → NOW",
        summary:
            "Co-founded the authorization layer for AI agents. I ship every layer of the platform: policy engine, SDKs, API, dashboard, and docs.",
        url: "https://veto.tools",
    },
    {
        org: "Teza Technologies",
        role: "Quant Research Intern",
        period: "SUMMER 2026",
        summary:
            "Alpha-signal research at a systematic trading firm: signal generation, survivorship-free backtesting, and conviction scoring.",
        url: "https://www.teza.com",
    },
    {
        org: "JSA Group",
        role: "Data Science & Security Intern",
        period: "JUN → AUG 2024",
        summary:
            "Shipped analyses adopted across teams, and automation that cut incident response by ~8 hrs/week.",
        url: "https://jsa-group.ru/en/",
    },
    {
        org: "Consolware GmbH",
        role: "ML Intern",
        period: "MAY → JUN 2024",
        summary:
            "Built a recommendation prototype (+16% top-5 precision) and led a 5-person solution-design team.",
        url: "https://www.consolware.com/",
    },
];

export type Project = {
    title: string;
    tone: string;
    year: string;
    role: string;
    blurb: string;
    receipt?: string;
    url: string;
    image?: string;
    plate?: boolean; // large exhibit treatment
};

export const shipped: Project[] = [
    {
        title: "Veto",
        tone: "#22c55e",
        year: "2026",
        role: "Co-Founder & Lead Engineer",
        blurb: "Runtime authorization for AI agents. Default-deny policies, sub-10ms decisions, 300+ edge locations, MCP native.",
        receipt: "YC S26 · top 10%",
        url: "https://veto.tools",
        image: "/projects/veto.webp",
        plate: true,
    },
    {
        title: "Senthos",
        tone: "#14b8a6",
        year: "2026",
        role: "Lead Developer",
        blurb: "Turns Polymarket positions into structured products: baskets, tranches, and principal-protected notes on Solana.",
        receipt: "1st · Solana track · SCBC 2026",
        url: "https://devfolio.co/projects/senthos-f3fb",
        image: "/projects/senthos.webp",
        plate: true,
    },
    {
        title: "Litter Critter",
        tone: "#a3e635",
        year: "2026",
        role: "Software Developer",
        blurb: "Autonomous robot that finds, picks up, and sorts trash with computer vision and a robotic arm, built in 24 hours at MIT.",
        receipt: "1st · MakeMIT × Harvard",
        url: "https://devpost.com/software/smart-bin-z83asr",
        image: "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1772132626/SpyLogger_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F_1_dc8vyw.png",
    },
    {
        title: "AutoStickers",
        tone: "#eab308",
        year: "2025",
        role: "Founder",
        blurb: "Telegram bot that bought new sticker packs the moment they dropped, on a 20% commission model. Now archived.",
        receipt: "$152k volume · ~2300 users",
        url: "https://t.me/Auto_Stickers_bot",
        image: "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1755166393/SpyLogger_1920x920_2_i4o1pe.png",
    },
    {
        title: "Phishing Website Detector",
        tone: "#f43f5e",
        year: "2024",
        role: "Founder",
        blurb: "Live URL scanner that scores phishing risk with its own 22-feature ML model, cross-checked against VirusTotal.",
        url: "https://phishing.lukres.dev/",
        image: "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169280/lukres.dev/6ae5hg1z.png",
    },
    {
        title: "SolveStream",
        tone: "#818cf8",
        year: "2024",
        role: "Founder",
        blurb: "Marketplace that paired students with experts over live video to work through academic problems. Now archived.",
        url: "https://solvestream.org/",
        image: "https://res.cloudinary.com/dygcwhekh/image/upload/f_auto,q_auto/v1734169401/lukres.dev/8ihmkcad.png",
    },
];

export type EarlierProject = { title: string; year: string; blurb: string; url: string };

export const earlier: EarlierProject[] = [
    { title: "Gifts Alert Bot", year: "2025", blurb: "Telegram gifts tracker that auto-posts alerts to your channels, with Stars subscriptions.", url: "https://t.me/GiftsAlertBot" },
    { title: "Astro", year: "2025", blurb: "Bot + WebApp for discounted Telegram Premium and Stars, with a referral system.", url: "https://t.me/AstroStarUpdates" },
    { title: "SpyLogger Bot", year: "2024", blurb: "Tracks message edits and deletions in Telegram chats with real-time notifications.", url: "https://t.me/SpyLogger_bot?start=_tgr_cKJHP1swYjYy" },
    { title: "RubberDucky Payloads", year: "2024", blurb: "Curated RubberDucky payload collection, tested on Flipper Zero.", url: "https://payloads.lukres.dev" },
    { title: "Microfluidics reactor", year: "2023", blurb: "Droplet-based microfluidics reactor for liposome formation, with a custom pump and silica chips.", url: "https://lukres.dev/cas" },
    { title: "Letovo SMP", year: "2022", blurb: "Minecraft SMP server for Letovo School: custom plugins and two years of community.", url: "https://discord.gg/ex8h77m49X" },
];

export type Record_ = {
    placement: string;
    event: string;
    detail: string;
    date: string;
    url: string;
    prize?: { value: number; prefix: string; suffix: string };
};

export const records: Record_[] = [
    {
        placement: "1ST",
        event: "MakeMIT × Harvard 2026",
        detail: "Sustainability Track - Litter Critter, an autonomous litter-sorting robot built in 24 hours",
        date: "FEB 2026",
        url: "https://devpost.com/software/smart-bin-z83asr",
    },
    {
        placement: "1ST",
        event: "SCBC Hackathon 2026",
        detail: "Solana Track - Senthos, structured products on prediction markets. The event's largest track.",
        date: "APR 2026",
        url: "https://devfolio.co/projects/senthos-f3fb",
        prize: { value: 15000, prefix: "$", suffix: " prize" },
    },
    {
        placement: "TOP 10%",
        event: "Y Combinator S26",
        detail: "Veto's application, out of every startup YC read that batch",
        date: "2026",
        url: "https://veto.tools",
    },
];

export type School = { school: string; period: string; detail: string; status: string; url: string };

export const education: School[] = [
    {
        school: "University of Chicago",
        period: "2025 → 2029",
        detail: "B.S. in Computer Science and Mathematics, focused on AI/ML, quant, and security - alongside Algo Group and Blockchain Chicago.",
        status: "CURRENT",
        url: "https://www.uchicago.edu/",
    },
    {
        school: "Letovo School",
        period: "2020 → 2025",
        detail: "IB Diploma Programme, Computer Science focus. Graduated with an IB score of 43.",
        status: "IB 43",
        url: "https://en.letovo.ru/",
    },
];

export const socials: Receipt[] = [
    { label: "GitHub", url: "https://github.com/lukresxd" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/lukres" },
    { label: "Telegram", url: "https://t.me/lukres" },
    { label: "YouTube", url: "https://www.youtube.com/@LuKres" },
    { label: "Last.fm", url: "https://www.last.fm/user/lukresxd" },
    { label: "Steam", url: "https://steamcommunity.com/id/lukresxd" },
    { label: "Discord", url: "https://discord.com/users/521903479971905546" },
    { label: "Email", url: "mailto:me@lukres.dev" },
];

export const DISCORD_ID = "521903479971905546";
