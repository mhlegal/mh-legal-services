import { useSeo } from "@/hooks/use-seo";
import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { TrainingHighlight } from "@/components/sections/TrainingHighlight";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function Home() {
  useSeo({
    title: "MH LEGAL SERVICES Pty Ltd | Corporate Insurance Brokerage",
    description: "A South African corporate insurance brokerage with 100+ agents. Product distribution, market activation, sales representation, agent training, in-service training, and compliance management."
  });

  return (
    <SiteLayout>
      <Hero />
      <WhatWeDo />
      <HowWeHelp />
      <TrainingHighlight />
      <PartnershipCTA />
    </SiteLayout>
  );
}
