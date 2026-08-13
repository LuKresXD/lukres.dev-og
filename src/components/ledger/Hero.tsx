import { motion, useReducedMotion } from "framer-motion";
import { receipts } from "@/data/ledger";
import StatusLine from "./StatusLine";
import { Arrow } from "./primitives";

export default function Hero() {
    const reduce = useReducedMotion();
    const enter = (delay: number) =>
        reduce
            ? {}
            : {
                  initial: { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.35, delay, ease: "easeOut" as const },
              };

    return (
        <section className="flex min-h-[calc(100dvh-3.5rem)] flex-col justify-between pt-14 pb-6">
            <div>
                <motion.div {...enter(0)}>
                    <StatusLine />
                </motion.div>

                <motion.h1
                    {...enter(0.08)}
                    className="font-display uppercase leading-[0.95] tracking-tight text-paper mt-6 text-[clamp(3.2rem,10.5vw,8.5rem)]"
                >
                    Luka
                    <br />
                    <span className="text-outline">Kresoja</span>
                </motion.h1>

                <motion.p {...enter(0.16)} className="mt-6 max-w-[38rem] text-lg md:text-xl text-mut leading-relaxed">
                    I build production systems: co-founder of{" "}
                    <a href="https://veto.tools" target="_blank" rel="noreferrer" className="text-paper underline underline-offset-4 decoration-phos/60 hover:decoration-phos duration-150">
                        Veto
                    </a>
                    , quant research at Teza, CS + Math at UChicago.
                </motion.p>

                <motion.ul {...enter(0.24)} aria-label="Verified claims" className="mt-8 flex flex-wrap gap-2">
                    {receipts.map((r) => (
                        <li key={r.label} className="flex">
                            <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group font-mono text-xs sm:text-sm text-mut border border-line px-3 py-2 hover:border-phos/60 hover:text-paper duration-150"
                            >
                                <span className="text-phos mr-2" aria-hidden>✓</span>
                                {r.label} <Arrow />
                            </a>
                        </li>
                    ))}
                </motion.ul>
            </div>

            <motion.div
                {...enter(0.4)}
                className="flex items-baseline justify-between border-t border-line pt-3 font-mono text-xs text-faint"
            >
                <span>STATEMENT OF WORK · 2022 → 2026</span>
            </motion.div>
        </section>
    );
}
