"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Languages,
  ScanSearch,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/sandbox/header";
import { Footer } from "@/components/sandbox/footer";
import { Overview } from "@/components/sandbox/overview";
import { PolicyIntelligence } from "@/components/sandbox/policy-intelligence";
import { BulletinRegistry } from "@/components/sandbox/bulletin-registry";
import { TradeMatchmaker } from "@/components/sandbox/trade-matchmaker";

type TabKey = "overview" | "policy" | "bulletins" | "trade";

export default function Home() {
  const [tab, setTab] = useState<TabKey>("overview");

  const handleJump = (key: string) => {
    setTab(key as TabKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-100/60">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabKey)}
          className="w-full"
        >
          <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-white p-1.5 shadow-sm sm:grid-cols-4">
            <TabsTrigger
              value="overview"
              className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="policy"
              className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm"
            >
              <Languages className="h-4 w-4" aria-hidden="true" />
              Policy Intelligence
            </TabsTrigger>
            <TabsTrigger
              value="bulletins"
              className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm"
            >
              <ScanSearch className="h-4 w-4" aria-hidden="true" />
              Bulletin Verification
            </TabsTrigger>
            <TabsTrigger
              value="trade"
              className="flex-col gap-1 py-2.5 text-xs sm:flex-row sm:text-sm"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
              Trade Matchmaker
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
