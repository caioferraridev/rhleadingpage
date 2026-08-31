import Image from "next/image";
import { Section, SectionTitle } from "@/components/ui/section";
import { eventConfig } from "@/lib/event-config";
import { Award, Briefcase, GraduationCap } from "lucide-react";

const highlightIcons = [Briefcase, GraduationCap, Award];

export function Speaker() {
  const { speaker } = eventConfig;

  return (
    <Section id="palestrante" className="bg-slate-950">
      <SectionTitle className="[&_h2]:text-white [&_p]:text-slate-400">
        Conheça sua <span className="text-amber-500">palestrante</span>
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto bg-slate-800">
            <Image
              src={speaker.imageUrl}
              alt={speaker.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{speaker.name}</h3>
          <p className="text-amber-500 font-semibold mb-6 text-lg">{speaker.role}</p>

          <p className="text-slate-300 leading-relaxed mb-8">{speaker.bio}</p>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg mb-4">Destaques profissionais</h4>
            {speaker.highlights.map((highlight, index) => {
              const Icon = highlightIcons[index % highlightIcons.length];
              return (
                <div
                  key={highlight}
                  className="flex items-start gap-3 bg-white/5 rounded-xl p-4"
                >
                  <Icon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-slate-300">{highlight}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 max-w-5xl mx-auto text-center">
        <p className="text-amber-300 text-sm font-semibold">
          Informações da palestrante serão atualizadas em breve. Fique de olho!
        </p>
      </div>
    </Section>
  );
}
