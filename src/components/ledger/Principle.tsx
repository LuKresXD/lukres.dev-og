import { Reveal } from "./primitives";

export default function Principle() {
    return (
        <section className="mt-24 border-y border-line bg-panel">
            <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8 py-16 grid grid-cols-12 gap-x-6 gap-y-8">
                <Reveal className="col-span-12 md:col-span-7">
                    <h2 className="font-display uppercase leading-[1.02] tracking-tight text-paper text-3xl md:text-5xl">
                        My bar for done
                        <br />
                        is <span className="text-phos">production</span>.
                    </h2>
                </Reveal>
                <Reveal delay={0.08} className="col-span-12 md:col-span-5">
                    <p className="text-mut leading-relaxed">
                        Real users, real uptime, real numbers. I&apos;ve been shipping software since I
                        was 12: Telegram bots that handled real money, ML tools, and now Veto,
                        the authorization layer I co-founded for AI agents.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
