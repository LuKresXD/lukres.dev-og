import Link from "next/link";

const links = [
    { label: "WORK", href: "#work" },
    { label: "SHIPPED", href: "#shipped" },
    { label: "RECORDS", href: "#records" },
];

export default function Frame() {
    return (
        <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-phos focus:px-3 focus:py-1 focus:font-mono focus:text-xs focus:text-ink"
            >
                Skip to content
            </a>
            <nav className="mx-auto flex h-14 w-full max-w-[1120px] items-center gap-x-6 px-5 md:px-8">
                <Link href="/" className="flex items-baseline gap-x-2">
                    <span className="font-display text-lg leading-none text-paper">LK</span>
                    <span className="font-mono text-xs text-faint hidden sm:inline">/ LEDGER</span>
                </Link>
                <div className="ml-auto flex items-center gap-x-4 sm:gap-x-6">
                    {links.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            className="font-mono text-xs text-mut hover:text-paper duration-150 hidden sm:inline"
                        >
                            {l.label}
                        </a>
                    ))}
                    <a
                        href="mailto:me@lukres.dev"
                        className="font-mono text-xs text-phos border border-phos/40 px-3.5 py-2.5 hover:bg-phos hover:text-ink duration-150"
                    >
                        CONTACT
                    </a>
                </div>
            </nav>
        </header>
    );
}
