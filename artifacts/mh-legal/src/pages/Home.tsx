import { useSeo } from "@/hooks/use-seo";
import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { TrainingHighlight } from "@/components/sections/TrainingHighlight";
import { PartnershipCTA } from "@/components/sections/PartnershipCTA";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function Home() {
  useSeo({
    title: "Corporate Legal & Operations Partner",
    description: "MH LEGAL builds operational systems and develops people for scalable corporate growth."
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
