import React from 'react';
import { Home, Briefcase, GraduationCap, Dumbbell, Plane, Star, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface UsualJourneysSectionProps {
  onSelectJourney: (origin: string, destination: string) => void;
}

const USUAL_JOURNEYS = [
  {
    id: 'home',
    title: 'Home',
    icon: Home,
    loc: 'Koramangala 80ft Road, Bengaluru',
    sub: 'Primary Residence',
    usualTime: '18 min avg',
  },
  {
    id: 'work',
    title: 'Work / Office',
    icon: Briefcase,
    loc: 'Whitefield ITPL Main Road, Bengaluru',
    sub: 'Tech Park Campus',
    usualTime: '34 min via ORR',
  },
  {
    id: 'college',
    title: 'College / Uni',
    icon: GraduationCap,
    loc: 'Christ University, Hosur Road, Bengaluru',
    sub: 'South Campus Hub',
    usualTime: '22 min avg',
  },
  {
    id: 'gym',
    title: 'Gym & Fitness',
    icon: Dumbbell,
    loc: 'Cult.fit HSR Layout Sector 1, Bengaluru',
    sub: 'Morning Workout',
    usualTime: '12 min avg',
  },
  {
    id: 'airport',
    title: 'BLR Airport',
    icon: Plane,
    loc: 'Kempegowda International Airport (BLR)',
    sub: 'Terminal 1 & 2 Express',
    usualTime: '48 min via Elevated',
  },
  {
    id: 'saved',
    title: 'Saved Hubs',
    icon: Star,
    loc: 'Indiranagar 100ft Road, Bengaluru',
    sub: 'Weekend Social District',
    usualTime: '16 min avg',
  },
];

export const UsualJourneysSection: React.FC<UsualJourneysSectionProps> = ({
  onSelectJourney,
}) => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-orange-950/60">
      <ScrollReveal direction="up" delay={50}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="font-mono text-xs floating-text-orange uppercase tracking-wider block mb-1">
              FREQUENT URBAN COMMUTES
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl floating-text-primary">
              Your Usual Journeys
            </h2>
          </div>
          <p className="text-xs font-mono floating-text-sub max-w-md">
            One-touch trajectory arbitration with automated live traffic shockwave bypass.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {USUAL_JOURNEYS.map((j, idx) => {
          const Icon = j.icon;
          return (
            <ScrollReveal key={j.id} direction="up" delay={60 * (idx + 1)}>
              <div
                onClick={() => onSelectJourney('Koramangala 80ft Road, Bengaluru', j.loc)}
                className="p-4 rounded-2xl glass-hud hover:border-orange-400 bg-stone-950/70 border border-orange-950 transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-1 flex flex-col justify-between h-44"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-black border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:border-orange-300 transition-all mb-3 shadow-md">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm floating-text-primary group-hover:text-orange-200 transition-colors">
                    {j.title}
                  </h3>
                  <p className="text-[10px] font-mono floating-text-muted mt-0.5 line-clamp-1">
                    {j.sub}
                  </p>
                </div>

                <div className="pt-2 border-t border-orange-950/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-orange-400 font-semibold">{j.usualTime}</span>
                  <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
