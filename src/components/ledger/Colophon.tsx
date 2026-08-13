import { socials } from "@/data/ledger";
import { Reveal, Arrow } from "./primitives";

function buildDate() {
    const d = process.env.NEXT_PUBLIC_BUILD_DATE ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE) : new Date();
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).toUpperCase();
}

export default function Colophon() {
    return (
        <footer className="mt-24 border-t border-line">
            <div className="grid grid-cols-12 gap-x-6 gap-y-8 py-12">
                <Reveal className="col-span-12 md:col-span-7">
                    <p className="font-display text-2xl uppercase tracking-tight text-paper leading-none">
                        Luka Krestinin <span className="text-faint">· AKA LUKRES</span>
                    </p>
                    <p className="text-mut mt-4 max-w-[30rem] leading-relaxed">
                        The fastest way to reach me is Telegram or email. If you want proof for any
                        line on this page, every claim above links to its source.
                    </p>
                </Reveal>
                <Reveal delay={0.06} className="col-span-12 md:col-span-5">
                    <ul className="grid grid-cols-2 gap-x-8">
                        {socials.map((s) => (
                            <li key={s.label}>
                                <a
                                    href={s.url}
                                    target={s.url.startsWith("mailto") ? undefined : "_blank"}
                                    rel="noreferrer"
                                    className="group flex items-baseline justify-between border-b border-line py-2 font-mono text-sm text-mut hover:text-paper duration-150"
                                >
                                    {s.label.toUpperCase()}
                                    <span className="text-faint group-hover:text-phos duration-150"><Arrow /></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>

            <div className="border-t border-line py-6 font-mono text-xs text-faint space-y-1.5">
                <p>
                    LUKRES.DEV · NEXT.JS + TAILWIND · LAST UPDATED {buildDate()}
                </p>
                <p>
                    EST. APRIL 2024 · BUILT IN THE PRE-AI ERA{" "}
                    <a
                        href="https://github.com/LuKresXD/LuKres.dev/commits/main"
                        target="_blank"
                        rel="noreferrer"
                        className="text-mut hover:text-paper duration-150 underline underline-offset-4 decoration-line"
                    >
                        (COMMITS TO PROVE IT)
                    </a>
                </p>
                <p aria-hidden>
                    <span className="text-mut">$</span> veto audit lukres.dev →{" "}
                    <span className="text-phos">0 unverified claims</span>
                    <span className="inline-block w-[0.6em] h-[1.05em] bg-phos align-text-bottom ml-1 motion-safe:animate-blink" />
                </p>
            </div>
        </footer>
    );
}
