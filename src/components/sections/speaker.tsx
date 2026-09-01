import Image from "next/image";
import { Section, SectionTitle } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { eventConfig } from "@/lib/event-config";
import { Award, Briefcase, GraduationCap, Quote } from "lucide-react";

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
            Conheça sua <span className="text-teal-300">palestrante</span>
          </SectionTitle>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center max-w-5xl mx-auto">
          <Reveal delay={100}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[1.8rem] bg-gradient-to-br from-teal-400/30 to-transparent" aria-hidden />
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto border border-white/10">
                <Image
                  src={speaker.imageUrl}
                  alt={speaker.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-teal-300" />
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
                {speaker.name}
              </h3>
              <p className="text-teal-300 font-bold mb-7 text-lg">{speaker.role}</p>

              <p className="text-navy-100/80 leading-relaxed mb-9 max-w-xl">{speaker.bio}</p>

              <div className="space-y-4">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-px h-5 bg-teal-400" aria-hidden />
                  Destaques profissionais
                </h4>
                {speaker.highlights.map((highlight, index) => {
                  const Icon = highlightIcons[index % highlightIcons.length];
                  return (
                    <div
                      key={highlight}
                      className="flex items-start gap-4 bg-white/[0.06] backdrop-blur rounded-xl p-4 border border-white/5"
                    >
                      <span className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-teal-300" />
                      </span>
                      <p className="text-navy-50/85">{highlight}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="mt-12 bg-white/[0.05] border border-white/10 rounded-2xl p-6 max-w-3xl mx-auto text-center">
            <p className="text-teal-200/90 text-sm font-semibold">
              Informações da palestrante serão atualizadas em breve. Fique de olho!
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
