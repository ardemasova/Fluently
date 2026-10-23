import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { ProblemSolution } from "@/components/marketing/ProblemSolution";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ScenarioExplorer } from "@/components/marketing/ScenarioExplorer";
import { VoiceShowcase } from "@/components/marketing/VoiceShowcase";
import { ProgressSection } from "@/components/marketing/ProgressSection";
import { TeacherSection } from "@/components/marketing/TeacherSection";
import { Pricing } from "@/components/marketing/Pricing";
import { FinalCta } from "@/components/marketing/FinalCta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <ScenarioExplorer />
        <VoiceShowcase />
        <ProgressSection />
        <TeacherSection />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
