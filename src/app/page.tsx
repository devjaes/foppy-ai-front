import { HeroSection } from "@/features/landing/components/HeroSection";
import { PlansSection } from "@/features/landing/components/PlansSection";

export default function Page() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background max-w-screen-xl mx-auto">
      <HeroSection />
      <div id="plans">
        <PlansSection />
      </div>
    </main>
  );
}
