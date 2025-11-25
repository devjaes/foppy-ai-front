import { HeroSection } from "@/features/landing/components/HeroSection";
import { PlansSection } from "@/features/landing/components/PlansSection";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <div id="plans">
        <PlansSection />
      </div>
    </main>
  );
}
