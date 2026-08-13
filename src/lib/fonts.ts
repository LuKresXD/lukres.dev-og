import { Archivo_Black, Archivo, JetBrains_Mono } from "next/font/google";

export const display = Archivo_Black({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
});

export const sans = Archivo({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable}`;
