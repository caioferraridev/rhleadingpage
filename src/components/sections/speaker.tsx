import Image from "next/image";
import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { eventConfig } from "@/lib/event-config";
import { Award, Briefcase, GraduationCap } from "lucide-react";

const highlightIcons = [Briefcase, GraduationCap, Award];

export function Speaker() {
  const { speaker } = eventConfig;

  return (
    <Section
      id="palestrante"
      className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-600"
    >
      {/* Decorative rings */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-teal-400/20 pointer-events-none" aria-hidden />
      <div className="absolute top-10 -left-20 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" aria-hidden />

      <div className="relative">
        <Reveal>
          <SectionTitle className="[&_h2]:text-white [&_p]:text-navy-100/70" eyebrow="Palestrante">
            Quem é <span className="text-teal-300">{speaker.name}</span>?
          </SectionTitle>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-14 items-center max-w-5xl mx-auto">
          <Reveal delay={100}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[1.8rem] bg-gradient-to-br from-teal-400/30 to-transparent" aria-hidden />
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl aspect-[2/3] max-w-md mx-auto border border-white/10">
                <Image
                  src={speaker.imageUrl}
                  alt={speaker.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
                {speaker.name}
              </h3>
              <p className="text-teal-300 font-bold mb-6 text-lg">{speaker.role}</p>

              <p className="text-navy-100/80 leading-relaxed max-w-xl mb-6">
                {speaker.bioIntro}
              </p>

              <blockquote className="text-xl md:text-2xl font-bold text-white leading-snug border-l-2 border-teal-400 pl-4 max-w-xl">
                {speaker.bioQuote}
              </blockquote>

              <ul className="space-y-3 mt-9">
                {speaker.highlights.map((highlight, index) => {
                  const Icon = highlightIcons[index % highlightIcons.length];
                  return (
                    <li
                      key={highlight}
                      className="flex items-start gap-4 bg-white/[0.06] backdrop-blur rounded-xl p-4 border border-white/5"
                    >
                      <span className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-teal-300" />
                      </span>
                      <span className="text-navy-50/85">{highlight}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}