import React from 'react';
import { CinematicHero } from '../components/CinematicHero';
import { CityNeverStops } from '../components/CityNeverStops';
import { FeatureStory } from '../components/FeatureStory';
import { RouteIntelligence } from '../components/RouteIntelligence';
import { ProcessSection } from '../components/ProcessSection';
import { LiveTrafficSection } from '../components/LiveTrafficSection';
import { WhyDisha } from '../components/WhyDisha';
import { FinalCTA } from '../components/FinalCTA';

interface HomePageProps {
  onStartPlanning: () => void;
  onOpenLiveTraffic: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartPlanning,
  onOpenLiveTraffic,
}) => {
  const handleExploreDisha = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-transparent min-h-screen text-slate-100 overflow-x-hidden relative">
      
      {/* 1. CINEMATIC HERO */}
      <CinematicHero
        onExploreDisha={handleExploreDisha}
      />

      {/* 2. THE CITY NEVER STOPS */}
      <CityNeverStops />

      {/* 3. PERCEPTION & SENSOR MESH */}
      <FeatureStory />

      {/* 4. ROUTE INTELLIGENCE — MULTIPLE POSSIBILITIES */}
      <RouteIntelligence />

      {/* 5. FROM SIGNAL TO DECISION */}
      <ProcessSection />

      {/* 6. THE ROAD CHANGES. DISHA RESPONDS */}
      <LiveTrafficSection onOpenLiveTrafficModal={onOpenLiveTraffic} />

      {/* 7. WHY DISHA */}
      <WhyDisha />

      {/* 8. FINAL ACTION AT BOTTOM OF WEBSITE: START PLANNING */}
      <FinalCTA onStartPlanning={onStartPlanning} />

    </main>
  );
};
