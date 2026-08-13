import { useEffect, useState } from "react";
import { DISCORD_ID } from "@/data/ledger";

type Lanyard = {
    discord_status?: string;
    listening_to_spotify?: boolean;
    spotify?: { song: string; artist: string } | null;
    activities?: { type: number; name: string; state?: string }[];
};

function useCentralClock() {
    const [time, setTime] = useState("");
    useEffect(() => {
        const fmt = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit", minute: "2-digit", second: "2-digit",
            hour12: false, timeZone: "America/Chicago",
        });
        const tick = () => setTime(fmt.format(new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

export default function StatusLine() {
    const [presence, setPresence] = useState<Lanyard | null>(null);
    const time = useCentralClock();

    useEffect(() => {
        let alive = true;
        const poll = async () => {
            try {
                const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
                const json = await res.json();
                if (alive && json?.success) setPresence(json.data);
            } catch { /* status line degrades to the clock alone */ }
        };
        poll();
        const id = setInterval(poll, 60_000);
        return () => { alive = false; clearInterval(id); };
    }, []);

    const online = presence?.discord_status && presence.discord_status !== "offline";
    let detail: string | null = null;
    if (presence?.listening_to_spotify && presence.spotify) {
        detail = `PLAYING: ${presence.spotify.song} · ${presence.spotify.artist}`.toUpperCase();
    } else {
        const game = presence?.activities?.find((a) => a.type === 0);
        if (game) detail = `IN: ${game.name}`.toUpperCase();
    }

    return (
        <p className="font-mono text-xs sm:text-sm text-mut flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-x-2">
                <span
                    aria-hidden
                    className={`h-2 w-2 rounded-full ${online ? "bg-phos motion-safe:animate-pulse" : "bg-faint"}`}
                />
                <span className={online ? "text-phos" : "text-mut"}>{online ? "LIVE" : "STANDBY"}</span>
            </span>
            {detail && <span className="truncate max-w-[16rem] sm:max-w-sm">{detail}</span>}
            <span className="text-faint" aria-hidden>·</span>
            {time && <span suppressHydrationWarning>{time} CT</span>}
        </p>
    );
}
