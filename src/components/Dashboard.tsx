"use client";



import { useState, useCallback } from "react";

import { useFloorPlan } from "@/hooks/useFloorPlan";

import { useProjectVariants } from "@/hooks/useProjectVariants";

import { ChatPanel } from "./ChatPanel";

import { VisualizationPanel } from "./VisualizationPanel";

import { InfoPanel } from "./InfoPanel";

import { ExpertsPanel } from "./ExpertsPanel";

import { VariantsPanel } from "./VariantsPanel";

import { parterRooms, pietroRooms } from "@/data/rooms";
import { parterHikoraAdapt, pietroHikoraAdapt } from "@/data/rooms-hikora-adapt";

import { averageScore } from "@/lib/expert-review";

import { createVariantFromIntent, createHikoraAdaptVariant, resolveBuildingSize } from "@/lib/project-transforms";

import type { AgentAction } from "@/lib/agent-actions";
import type { ExpertDebateResult, ExpertOpinion, ExpertSessionMode, IdealProjectResult } from "@/types/variant";



type MobileView = "chat" | "viz" | "info" | "experts" | "variants";

type RightTab = "info" | "experts" | "variants";



export function Dashboard() {

  const {

    visualization,

    showFloorPlan,

    showPlotMap,

    showTopography,

    showSatellite,

    show3D,

    highlightRoom,

  } = useFloorPlan();



  const {

    variants,

    activeVariant,

    activeId,

    setActiveId,

    saveVariant,

    deleteVariant,

    updateActiveReviews,

    exportVariant,

    hydrated,

  } = useProjectVariants();



  const [mobileView, setMobileView] = useState<MobileView>("chat");

  const [rightTab, setRightTab] = useState<RightTab>("variants");

  const [reviewLoading, setReviewLoading] = useState(false);
  const [debateResult, setDebateResult] = useState<ExpertDebateResult | null>(null);
  const [idealResult, setIdealResult] = useState<IdealProjectResult | null>(null);



  const roomsForFloor =

    visualization.floor === "pietro"

      ? activeVariant?.roomsOverride?.pietro ?? pietroRooms

      : activeVariant?.roomsOverride?.parter ?? parterRooms;



  const allRooms = [

    ...(activeVariant?.roomsOverride?.parter ?? parterRooms),

    ...(activeVariant?.roomsOverride?.pietro ?? pietroRooms),

  ];



  const buildingSize = resolveBuildingSize(activeVariant);



  const handleAction = useCallback(

    (action: AgentAction) => {

      switch (action.name) {

        case "showFloorPlan": {

          const floor = action.params.floor === "pietro" ? "pietro" : "parter";

          showFloorPlan(floor);

          setMobileView("viz");

          break;

        }

        case "showPlotMap":

          showPlotMap();

          setMobileView("viz");

          break;

        case "showTopography":

          showTopography();

          setMobileView("viz");

          break;

        case "showSatellite":

          showSatellite();

          setMobileView("viz");

          break;

        case "show3D":

          show3D();

          setMobileView("viz");

          break;

        case "highlightRoom": {

          const { roomId, floor } = action.params;

          if (!roomId) break;

          const room = allRooms.find((r) => r.id === roomId);

          const targetFloor =

            floor === "pietro" || floor === "parter"

              ? floor

              : room?.floor ?? "parter";

          highlightRoom(roomId, targetFloor);

          setMobileView("viz");

          break;

        }

      }

    },

    [showFloorPlan, showPlotMap, showTopography, showSatellite, show3D, highlightRoom, allRooms],

  );



  const mergeReviews = useCallback(
    (incoming: ExpertOpinion[]) => {
      const existing = activeVariant?.expertReviews ?? [];
      const merged = new Map(existing.map((review) => [review.expertId, review]));
      incoming.forEach((review) => merged.set(review.expertId, review));
      updateActiveReviews(Array.from(merged.values()));
    },
    [activeVariant?.expertReviews, updateActiveReviews],
  );

  const handleExpertSession = useCallback(
    async ({ mode, expertIds }: { mode: ExpertSessionMode; expertIds: string[] }) => {
      if (!activeVariant && mode !== "ideal") return;

      setReviewLoading(true);
      try {
        const linkCtx = activeVariant?.referenceLinks
          .map((l) => l.title ?? l.url)
          .join("; ");

        const res = await fetch("/api/expert-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            variant: activeVariant,
            variants,
            expertIds,
            linkContext: linkCtx,
          }),
        });

        const data = await res.json();
        if (!res.ok) return;

        if (data.reviews) mergeReviews(data.reviews);
        if (data.debate) setDebateResult(data.debate);
        else if (mode !== "debate") setDebateResult(null);

        if (data.ideal) setIdealResult(data.ideal);
        else if (mode !== "ideal") setIdealResult(null);

        setRightTab("experts");
        setMobileView("experts");
      } finally {
        setReviewLoading(false);
      }
    },
    [activeVariant, variants, mergeReviews],
  );



  const seedDemoVariant = useCallback(() => {

    const demo = createVariantFromIntent(

      "Wariant B — lustrzane odbicie",

      "lustrzane odbicie bryły względem osi wschód-zachód (demo)",

      "mirror-ew",

      [{ url: "https://www.archdaily.com", title: "ArchDaily — inspiracja układu" }],

    );

    saveVariant(demo);

    showPlotMap();

    setMobileView("viz");

  }, [saveVariant, showPlotMap]);



  const seedHikoraAdapt = useCallback(() => {
    const variant = createHikoraAdaptVariant();
    saveVariant(variant);
    highlightRoom("salon", "parter");
    setMobileView("viz");
  }, [saveVariant, highlightRoom]);



  const reviews = activeVariant?.expertReviews ?? [];

  const avgScore = reviews.length ? averageScore(reviews) : 0;



  if (!hydrated) {

    return (

      <div className="flex h-dvh items-center justify-center text-text-muted">

        Ładowanie wariantów…

      </div>

    );

  }



  return (

    <div className="flex h-dvh flex-col overflow-hidden">

      <header className="flex shrink-0 items-center justify-between border-b border-border bg-bg-panel px-4 py-2 lg:hidden">

        <h1 className="font-serif text-base text-accent">Oaza Spokoju</h1>

        <nav className="flex flex-wrap gap-1 justify-end">

          {(

            [

              ["chat", "Chat"],

              ["viz", "Wiz"],

              ["variants", "Warianty"],

              ["experts", "Eksperci"],

              ["info", "Info"],

            ] as const

          ).map(([view, label]) => (

            <button

              key={view}

              type="button"

              onClick={() => setMobileView(view)}

              className={`rounded-md px-2 py-1 text-[10px] font-medium ${

                mobileView === view

                  ? "bg-accent text-white"

                  : "bg-border/50 text-text-muted"

              }`}

            >

              {label}

            </button>

          ))}

        </nav>

      </header>



      <div className="hidden shrink-0 items-center gap-2 border-b border-border bg-bg-panel px-4 py-2 lg:flex">

        <span className="mr-2 font-serif text-sm text-accent">Oaza Spokoju</span>

        <button type="button" onClick={() => showFloorPlan("parter")} className="toolbar-btn">

          Rzut parteru

        </button>

        <button type="button" onClick={() => showFloorPlan("pietro")} className="toolbar-btn">

          Rzut piętra

        </button>

        <button type="button" onClick={() => showPlotMap()} className="toolbar-btn">

          Mapa działki

        </button>

        <button type="button" onClick={() => showSatellite()} className="toolbar-btn">

          Satelita

        </button>

        <button type="button" onClick={() => showTopography()} className="toolbar-btn">

          Topografia

        </button>

        <button type="button" onClick={() => show3D()} className="toolbar-btn">

          Bryła 3D

        </button>

        <span className="ml-auto text-xs text-text-muted">

          Aktywny: <strong className="text-accent">{activeVariant?.name}</strong>

        </span>

        <button

          type="button"

          onClick={seedHikoraAdapt}

          className="rounded-lg border border-accent/40 px-2 py-1 text-xs text-accent hover:bg-accent/5"

        >

          Adaptacja Hikora

        </button>

        {variants.length <= 2 && (

          <button

            type="button"

            onClick={seedDemoVariant}

            className="rounded-lg border border-border px-2 py-1 text-xs text-text-muted hover:border-accent/40"

          >

            Demo: lustrzane odbicie

          </button>

        )}

      </div>



      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[320px_1fr_340px]">

        <div

          className={`min-h-0 ${

            mobileView === "chat" ? "flex" : "hidden"

          } lg:flex lg:flex-col`}

        >

          <ChatPanel

            onAction={handleAction}

            onShowVisualization={() => setMobileView("viz")}

          />

        </div>



        <div

          className={`min-h-0 ${

            mobileView === "viz" ? "flex" : "hidden"

          } lg:flex lg:flex-col`}

        >

          <VisualizationPanel

            visualization={visualization}

            setbacks={activeVariant?.setbacks}

            roomsForFloor={roomsForFloor}

            isHikoraAdapt={activeVariant?.transform === "adapt-hikora"}

            hikoraParterRooms={parterHikoraAdapt}

            hikoraPietroRooms={pietroHikoraAdapt}

            variantLabel={activeVariant?.name}

            buildingWidthWE={buildingSize.widthWE}

            buildingLengthNS={buildingSize.lengthNS}

            onRoomClick={(roomId) => {

              highlightRoom(roomId);

              setMobileView("viz");

            }}

            onShowFloorPlan={showFloorPlan}

            onShowPlotMap={showPlotMap}

            onShowSatellite={showSatellite}

            onShowTopography={showTopography}

          />

        </div>



        <div className="hidden min-h-0 flex-col border-l border-border lg:flex">

          <div className="flex shrink-0 border-b border-border">

            {(

              [

                ["variants", "Warianty"],

                ["experts", "Eksperci"],

                ["info", "Info"],

              ] as const

            ).map(([tab, label]) => (

              <button

                key={tab}

                type="button"

                onClick={() => setRightTab(tab)}

                className={`flex-1 px-2 py-2 text-xs font-medium ${

                  rightTab === tab

                    ? "border-b-2 border-accent text-accent"

                    : "text-text-muted hover:text-text"

                }`}

              >

                {label}

              </button>

            ))}

          </div>

          <div className="min-h-0 flex-1">

            {rightTab === "info" && (
              <InfoPanel
                buildingSize={buildingSize}
                setbacks={activeVariant?.setbacks}
                variantName={activeVariant?.name}
              />
            )}

            {rightTab === "experts" && (

              <ExpertsPanel

                reviews={reviews}

                averageScore={avgScore}

                loading={reviewLoading}

                debate={debateResult}

                ideal={idealResult}

                onExpertSession={handleExpertSession}

                onApplyIdealVariant={setActiveId}

              />

            )}

            {rightTab === "variants" && (

              <VariantsPanel

                variants={variants}

                activeId={activeId}

                onSelect={setActiveId}

                onSave={saveVariant}

                onDelete={deleteVariant}

                onExport={exportVariant}

                onBuilt={() => {

                  showPlotMap();

                  setMobileView("viz");

                }}

              />

            )}

          </div>

        </div>



        {/* Mobile-only panels */}

        <div

          className={`min-h-0 ${

            mobileView === "info" ? "flex" : "hidden"

          } lg:hidden lg:flex-col`}

        >

          <InfoPanel
            buildingSize={buildingSize}
            setbacks={activeVariant?.setbacks}
            variantName={activeVariant?.name}
          />

        </div>

        <div

          className={`min-h-0 ${

            mobileView === "experts" ? "flex" : "hidden"

          } lg:hidden lg:flex-col`}

        >

          <ExpertsPanel

            reviews={reviews}

            averageScore={avgScore}

            loading={reviewLoading}

            debate={debateResult}

            ideal={idealResult}

            onExpertSession={handleExpertSession}

            onApplyIdealVariant={setActiveId}

          />

        </div>

        <div

          className={`min-h-0 ${

            mobileView === "variants" ? "flex" : "hidden"

          } lg:hidden lg:flex-col`}

        >

          <VariantsPanel

            variants={variants}

            activeId={activeId}

            onSelect={setActiveId}

            onSave={saveVariant}

            onDelete={deleteVariant}

            onExport={exportVariant}

            onBuilt={() => {

              showPlotMap();

              setMobileView("viz");

            }}

          />

        </div>

      </div>

    </div>

  );

}


