import { education } from "@/data/ledger";
import { Reveal, SectionHead, Arrow } from "./primitives";

export default function Schooling() {
    return (
        <section className="mt-24">
            <SectionHead id="education" index="04" title="Education" note="2020 → 2029" />
            <ul className="mt-4">
                {education.map((s, i) => (
                    <li key={s.school}>
                        <Reveal delay={i * 0.05}>
                            <a
                                href={s.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative grid grid-cols-12 gap-x-4 gap-y-1 border-b border-line py-5 hover:bg-panel duration-150"
                            >
                                <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-phos scale-y-0 group-hover:scale-y-100 origin-top duration-200" />
                                <span className="col-span-12 sm:col-span-1 font-mono text-sm text-faint pl-3 sm:pl-0 sm:pt-1">
                                    {String(i + 1).padStart(3, "0")}
                                </span>
                                <div className="col-span-12 sm:col-span-8 pl-3 sm:pl-0">
                                    <h3 className="text-xl font-semibold text-paper leading-tight">
                                        {s.school}{" "}
                                        <span className="font-mono text-xs text-phos border border-phos/30 px-1.5 py-0.5 ml-1 align-middle">{s.status}</span>{" "}
                                        <span className="text-faint opacity-0 group-hover:opacity-100 duration-150"><Arrow /></span>
                                    </h3>
                                    <p className="text-mut mt-1.5 max-w-[36rem] leading-relaxed">{s.detail}</p>
                                </div>
                                <span className="col-span-12 sm:col-span-3 font-mono text-xs text-faint sm:text-right sm:pt-1.5 pl-3 sm:pl-0">
                                    {s.period}
                                </span>
                            </a>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </section>
    );
}
