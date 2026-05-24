"use client";

import { kartaTechniczna } from "@/data/karta-techniczna";

interface MassingViewProps {
  variantLabel?: string;
  buildingWidthWE?: number;
  buildingLengthNS?: number;
}

export function MassingView({
  variantLabel,
  buildingWidthWE = 14,
  buildingLengthNS = 10.84,
}: MassingViewProps) {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-4">
      <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#eef4e8] via-[#dfead7] to-[#c5d5c0] shadow-inner">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#8ea77c]/70 to-transparent" />
        <div className="absolute left-8 top-10 rounded-full bg-bg/80 px-3 py-1 text-xs text-text shadow">
          Północ · dz. 4/4
        </div>
        <div className="absolute bottom-10 left-8 rounded-full bg-bg/80 px-3 py-1 text-xs text-text shadow">
          Zachód · dz. 4/10 / dojazd
        </div>
        <div className="absolute bottom-10 right-8 rounded-full bg-bg/80 px-3 py-1 text-xs text-text shadow">
          Wschód · ogród
        </div>

        <div className="absolute left-1/2 top-[54%] h-36 w-72 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
          <div className="absolute left-10 top-20 h-24 w-56 skew-x-[-18deg] rounded-sm bg-[#bba78f] shadow-2xl" />
          <div className="absolute left-14 top-8 h-28 w-52 rounded-sm border border-[#8d785f] bg-[#d7c6ae] shadow-xl" />
          <div className="absolute left-14 top-8 h-28 w-20 border-r border-[#b39b80] bg-[#c7b296]" />
          <div className="absolute left-34 top-20 h-16 w-32 rounded border border-accent/40 bg-[#8fb6c8]/45" />
          <div className="absolute left-38 top-24 text-[10px] font-semibold text-accent">HST → ogród</div>
          <div className="absolute left-4 top-0 h-20 w-64 -skew-x-[24deg] rounded-sm bg-[#2d3136] shadow-lg" />
          <div className="absolute left-34 top-0 h-20 w-64 skew-x-[24deg] rounded-sm bg-[#45494f] shadow-lg" />
          <div className="absolute left-8 top-2 text-[10px] text-white/80">dach dwuspadowy {kartaTechniczna.building.roofAngle}°</div>
          <div className="absolute left-12 top-[132px] h-8 w-44 rounded bg-[#c69b6b]/70 shadow">
            <span className="flex h-full items-center justify-center text-[10px] font-medium text-[#4a2f18]">
              taras E/S
            </span>
          </div>
        </div>

        <div className="absolute right-5 top-5 w-52 rounded-xl border border-white/60 bg-bg/85 p-3 text-xs shadow backdrop-blur">
          <p className="font-medium text-accent">Makieta bryły</p>
          <p className="mt-1 text-text-muted">Budynek {buildingWidthWE} × {buildingLengthNS} m</p>
          <p className="mt-1 text-text-muted">NMT: {kartaTechniczna.elevation.minNW}-{kartaTechniczna.elevation.maxSE} m n.p.m.</p>
          {variantLabel && <p className="mt-1 text-text-muted">Wariant: {variantLabel}</p>}
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 text-xs md:grid-cols-3">
        <div className="rounded-lg border border-border bg-bg-panel p-3">
          <p className="font-medium text-accent">Cel widoku</p>
          <p className="mt-1 text-text-muted">Szybko ocenić bryłę, dach, HST i relację tarasu do ogrodu.</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-panel p-3">
          <p className="font-medium text-accent">Do dopracowania</p>
          <p className="mt-1 text-text-muted">Cienie sezonowe, elewacje N/S/E/W i wariant materiałowy.</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-panel p-3">
          <p className="font-medium text-accent">Eksperci</p>
          <p className="mt-1 text-text-muted">Top projektanci oceniają atmosferę; techniczni eksperci sprawdzają wykonalność.</p>
        </div>
      </div>
    </div>
  );
}
