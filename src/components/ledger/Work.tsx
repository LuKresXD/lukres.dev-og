import { work } from "@/data/ledger";
import { Reveal, SectionHead, Arrow } from "./primitives";

export default function Work() {
    return (
        <section className="mt-24">
            <SectionHead id="work" index="01" title="Work" note={`${work.length} ENTRIES`} />
            <ul className="mt-8">
                {work.map((w, i) => (
                    <li key={w.org}>
                        <Reveal delay={i * 0.04}>
                            <a
                                href={w.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative grid grid-cols-12 gap-x-4 gap-y-1 border-b border-line py-5 hover:bg-panel duration-150"
                            >
                                <span
                                    aria-hidden
                                    className="absolute left-0 top-0 h-full w-px bg-phos scale-y-0 group-hover:scale-y-100 origin-top duration-200"
                                />
                                <span className="col-span-12 sm:col-span-1 font-mono text-sm text-faint pl-3 sm:pl-0 sm:pt-1">
                                    {String(i + 1).padStart(3, "0")}
                                </span>
                                <div className="col-span-12 sm:col-span-8 pl-3 sm:pl-0">
                                    <h3 className="text-xl md:text-2xl font-semibold text-paper leading-tight">
                                        {w.org}{" "}
                                        <span className="text-mut font-normal">/ {w.role}</span>{" "}
                                        <span className="text-faint opacity-0 group-hover:opacity-100 duration-150"><Arrow /></span>
                                    </h3>
                                    <p className="text-mut mt-1.5 max-w-[36rem] leading-relaxed">{w.summary}</p>
                                </div>
                                <span className="col-span-12 sm:col-span-3 font-mono text-xs text-faint sm:text-right sm:pt-1.5 pl-3 sm:pl-0">
                                    {w.period}
                                </span>
                            </a>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </section>
    );
}
