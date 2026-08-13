import "@/styles/globals.css";
import { NextSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVars } from "@/lib/fonts";

export default function App({ Component, pageProps }: AppProps) {
    let router = useRouter();
    return (
        <div className={fontVars}>
            <NextSeo
                title={"LuKres.dev"}
                description={"LuKres' (aka Luka) personal site"}
                canonical={`https://lukres.dev${router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]}`}
                themeColor={"#0A0C0A"}
                openGraph={{
                    url: `https://lukres.dev${router.asPath.split("?")[0] === "/" ? "" : router.asPath.split("?")[0]}`,
                    title: "LuKres.dev",
                    description: "LuKres' (aka Luka) personal site",
                }}
            />
            <Component {...pageProps} />
            <Analytics />
            <SpeedInsights />
        </div>
    );
}
