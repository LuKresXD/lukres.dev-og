import { motion, useReducedMotion, useInView } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

// Mechanical reveal: short, precise, no spring. The ledger doesn't float.
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

export function SectionHead({ index, title, note, id }: { index: string; title: string; note: string; id?: string }) {
    return (
        <Reveal>
            <div id={id} className="flex items-baseline gap-x-4 border-t border-line pt-5 scroll-mt-24">
                <span className="font-mono text-sm text-faint shrink-0">{index}</span>
                <h2 className="font-display text-3xl md:text-5xl uppercase leading-none tracking-tight text-paper">
                    {title}
                </h2>
                <span className="font-mono text-xs text-faint ml-auto shrink-0 text-right">{note}</span>
            </div>
        </Reveal>
    );
}

// Count-up that settles on the exact value. Skips straight to the end for
// reduced motion.
export function Tick({ value, prefix = "", suffix = "", className }: { value: number; prefix?: string; suffix?: string; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduce = useReducedMotion();
    const [n, setN] = useState(reduce ? value : 0);

    useEffect(() => {
        if (!inView || reduce) return;
        const start = performance.now();
        const dur = 900;
        let raf: number;
        const step = (t: number) => {
            const p = Math.min((t - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(value * eased));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [inView, reduce, value]);

    return (
        <span ref={ref} className={className}>
            {prefix}{n.toLocaleString("en-US")}{suffix}
        </span>
    );
}

export function Arrow() {
    return <span aria-hidden className="inline-block translate-y-[-1px]">↗</span>;
}
