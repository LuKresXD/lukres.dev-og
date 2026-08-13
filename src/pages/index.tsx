import Head from "next/head";

import Frame from "@/components/ledger/Frame";
import Hero from "@/components/ledger/Hero";
import Work from "@/components/ledger/Work";
import Shipped from "@/components/ledger/Shipped";
import Principle from "@/components/ledger/Principle";
import Records from "@/components/ledger/Records";
import Schooling from "@/components/ledger/Schooling";
import Colophon from "@/components/ledger/Colophon";

export default function Home() {
    return (
        <div className="ledger bg-ink text-paper font-sans min-h-[100dvh] selection:bg-phos selection:text-ink">
            <Head>
                <title>LuKres.dev · Luka</title>
            </Head>
            <Frame />
            <main id="main">
                <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8">
                    <Hero />
                    <Work />
                    <Shipped />
                </div>
                <Principle />
                <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8">
                    <Records />
                    <Schooling />
                    <Colophon />
                </div>
            </main>
        </div>
    );
}
