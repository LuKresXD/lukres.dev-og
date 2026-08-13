import { shipped, earlier } from "@/data/ledger";
import { Reveal, SectionHead, Arrow } from "./primitives";

function Plate({ p, i, flip }: { p: (typeof shipped)[number]; i: number; flip: boolean }) {
    return (
        <Reveal>
            <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-cols-12 gap-x-6 gap-y-4 border-b border-line py-10 items-center"
            >
                <div className={`col-span-12 md:col-span-5 ${flip ? "md:order-2" : ""}`}>
                    <span className="font-mono text-sm text-faint">{String(i + 1).padStart(3, "0")}</span>
                    <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-paper mt-2 leading-none">
                        {p.title} <span className="text-faint text-2xl opacity-0 group-hover:opacity-100 duration-150"><Arrow /></span>
                    </h3>
                    <p className="text-mut mt-4 leading-relaxed max-w-[26rem]">{p.blurb}</p>
                    <dl className="mt-5 font-mono text-xs text-faint space-y-1.5">
                        <div className="flex gap-x-3">
                            <dt className="w-14 shrink-0">YEAR</dt>
                            <dd className="text-mut">{p.year}</dd>
                        </div>
                        <div className="flex gap-x-3">
                            <dt className="w-14 shrink-0">ROLE</dt>
                            <dd className="text-mut">{p.role.toUpperCase()}</dd>
                        </div>
                        {p.receipt && (
                            <div className="flex gap-x-3">
                                <dt className="w-14 shrink-0">PROOF</dt>
                                <dd style={{ color: p.tone }}>{p.receipt.toUpperCase()}</dd>
                            </div>
                        )}
                    </dl>
                </div>
                <div className={`col-span-12 md:col-span-7 ${flip ? "md:order-1" : ""}`}>
                    <div
                        className="border border-line overflow-hidden"
                        style={{ boxShadow: `0 0 60px -18px ${p.tone}33` }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={p.image}
                            alt={`${p.title} screenshot`}
                            loading={i === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="aspect-video w-full object-cover object-top group-hover:brightness-110 duration-200"
                        />
                    </div>
                </div>
            </a>
        </Reveal>
    );
}

function Row({ p, i }: { p: (typeof shipped)[number]; i: number }) {
    return (
        <Reveal delay={(i - 2) * 0.04}>
            <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group relative grid grid-cols-12 gap-x-4 gap-y-1 border-b border-line py-5 items-center hover:bg-panel duration-150"
            >
                <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-phos scale-y-0 group-hover:scale-y-100 origin-top duration-200" />
                <span className="col-span-12 sm:col-span-1 font-mono text-sm text-faint pl-3 sm:pl-0">
                    {String(i + 1).padStart(3, "0")}
                </span>
                <div className="col-span-9 sm:col-span-2 hidden md:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-14 w-full object-cover object-top border border-line"
                    />
                </div>
                <div className="col-span-12 sm:col-span-6 pl-3 sm:pl-0">
                    <h3 className="text-lg md:text-xl font-semibold text-paper leading-tight">
                        {p.title} <span className="text-faint opacity-0 group-hover:opacity-100 duration-150"><Arrow /></span>
                    </h3>
                    <p className="text-mut text-sm mt-1 leading-relaxed max-w-[30rem]">{p.blurb}</p>
                </div>
                <div className="col-span-12 sm:col-span-3 font-mono text-xs sm:text-right pl-3 sm:pl-0">
                    {p.receipt ? <span style={{ color: p.tone }}>{p.receipt.toUpperCase()}</span> : <span className="text-faint">{p.year}</span>}
                    {p.receipt && <span className="text-faint block mt-1">{p.year}</span>}
                </div>
            </a>
        </Reveal>
    );
}

export default function Shipped() {
    const plates = shipped.filter((p) => p.plate);
    const rows = shipped.filter((p) => !p.plate);

    return (
        <section className="mt-24">
            <SectionHead id="shipped" index="02" title="Shipped" note={`${shipped.length} + ${earlier.length} ENTRIES`} />
            <div className="mt-4">
                {plates.map((p, i) => (
                    <Plate key={p.title} p={p} i={i} flip={i % 2 === 1} />
                ))}
                {rows.map((p, i) => (
                    <Row key={p.title} p={p} i={i + plates.length} />
                ))}
            </div>

            <Reveal>
                <h3 className="font-mono text-xs text-faint mt-12 mb-2">EARLIER · 2022 → 2025</h3>
            </Reveal>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                {earlier.map((p, i) => (
                    <li key={p.title}>
                        <Reveal delay={i * 0.03}>
                            <a
                                href={p.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-baseline gap-x-3 border-b border-line py-3 hover:bg-panel duration-150"
                            >
                                <span className="font-mono text-xs text-faint shrink-0">{p.year}</span>
                                <span className="text-paper font-medium shrink-0">{p.title}</span>
                                <span className="text-mut text-sm truncate">{p.blurb}</span>
                                <span className="text-faint ml-auto shrink-0 opacity-0 group-hover:opacity-100 duration-150"><Arrow /></span>
                            </a>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </section>
    );
}
