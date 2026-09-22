"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Languages,
  ScanSearch,
  Terminal,
  Network,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/sandbox/header";
import { Footer } from "@/components/sandbox/footer";
import { Overview } from "@/components/sandbox/overview";
import { PolicyIntelligence } from "@/components/sandbox/policy-intelligence";
import { BulletinRegistry } from "@/components/sandbox/bulletin-registry";
import { TradeMatchmaker } from "@/components/sandbox/trade-matchmaker";
import { SandboxConsole } from "@/components/sandbox/console";
import { Architecture } from "@/components/sandbox/architecture";

type TabKey =
  | "overview"
  | "policy"
  | "bulletins"
  | "trade"
  | "console"
  | "architecture";

const NAV: {
  key: TabKey;
  numeral: string;
  label: string;
  icon: typeof Languages;
}[] = [
  { key: "overview", numeral: "I", label: "Overview", icon: LayoutDashboard },
  { key: "policy", numeral: "II", label: "Policy Intelligence", icon: Languages },
  { key: "bulletins", numeral: "III", label: "Bulletin Verification", icon: ScanSearch },
  { key: "trade", numeral: "IV", label: "Trade Matchmaker", icon: ArrowLeftRight },
  { key: "console", numeral: "V", label: "Sandbox Console", icon: Terminal },
  { key: "architecture", numeral: "VI", label: "Architecture", icon: Network },
];

export default function Home() {
  const [tab, setTab] = useState<TabKey>("overview");

  const handleJump = (key: string) => {
    setTab(key as TabKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabKey)}
        className="flex flex-1 flex-col"
      >
        {/* Index bar — sticky, document-style */}
        <div className="sticky top-0 z-40 border-b border-hairline bg-[#FBFAF5]/95 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-6xl px-4">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-0 rounded-none bg-transparent p-0 sm:grid-cols-3 lg:grid-cols-6">
              {NAV.map((item) => (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  className="flex-col gap-1 rounded-none border-0 border-b-2 border-transparent px-2 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft shadow-none transition-colors hover:text-navy data-[state=active]:bg-transparent data-[state=active]:text-navy data-[state=active]:shadow-none sm:flex-row sm:gap-2 sm:text-[11px]"
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="hidden font-serif text-[13px] font-semibold text-gold-ink sm:inline"
                    >
                      {item.numeral}.
                    </span>
                    <item.icon
                      className="h-3.5 w-3.5 sm:hidden"
                      aria-hidden="true"
                      strokeWidth={1.75}
                    />
                  </span>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-10">
          <TabsContent value="overview" className="mt-0">
            <Overview onJump={handleJump} />
          </TabsContent>
          <TabsContent value="policy" className="mt-0">
            <PolicyIntelligence />
          </TabsContent>
          <TabsContent value="bulletins" className="mt-0">
            <BulletinRegistry />
          </TabsContent>
          <TabsContent value="trade" className="mt-0">
            <TradeMatchmaker />
          </TabsContent>
          <TabsContent value="console" className="mt-0">
            <SandboxConsole />
          </TabsContent>
          <TabsContent value="architecture" className="mt-0">
            <Architecture />
          </TabsContent>
        </main>
      </Tabs>

      <Footer />
    </div>
  );
}
