import { useSeo } from "@/hooks/use-seo";
import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { TrainingHighlight } from "@/components/sections/TrainingHighlight";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function Home() {
  useSeo({
    title: "MH LEGAL SERVICES Pty Ltd | Altimate Chance To Freedom",
    description: "Professional legal assistance across South Africa — R200,000 legal cover, CCMA representation, contract drafting, debt collection, and civil rights advocacy."
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
