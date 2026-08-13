import { records } from "@/data/ledger";
import { Reveal, SectionHead, Tick, Arrow } from "./primitives";

export default function Records() {
    return (
        <section className="mt-24">
            <SectionHead id="records" index="03" title="Records" note="ALL VERIFIABLE" />
            <ul className="mt-4">
                {records.map((r, i) => (
                    <li key={r.event}>
                        <Reveal delay={i * 0.05}>
                            <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group grid grid-cols-12 gap-x-6 gap-y-2 border-b border-line py-8 items-baseline hover:bg-panel duration-150"
                            >
                                <span className="col-span-12 md:col-span-4 font-display uppercase tracking-tight leading-none text-phos text-[clamp(2.6rem,6vw,4.5rem)]">
                                    {r.placement}
                                </span>
                                <div className="col-span-12 md:col-span-6">
                                    <h3 className="text-xl md:text-2xl font-semibold text-paper leading-tight">
                                        {r.event} <span className="text-faint opacity-0 group-hover:opacity-100 duration-150"><Arrow /></span>
                                    </h3>
                                    <p className="text-mut mt-1.5 leading-relaxed max-w-[32rem]">
                                        {r.detail}
                                        {r.prize && (
                                            <span className="text-paper font-medium">
                                                {" "}<Tick value={r.prize.value} prefix={r.prize.prefix} suffix={r.prize.suffix} className="font-mono" />.
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <span className="col-span-12 md:col-span-2 font-mono text-xs text-faint md:text-right">
                                    {r.date}
                                </span>
                            </a>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </section>
    );
}
