import { Section, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { eventConfig } from "@/lib/event-config";

export function WhoFor() {
  return (
    <Section id="para-quem">
      <SectionTitle subtitle="Se você se identificou com alguma dessas situações, este encontro foi pensado para você.">
        Essa palestra é para você que...
      </SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventConfig.targetAudience.map((item, index) => (
          <Card hover key={item} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-amber-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-slate-800 font-semibold mt-1">{item}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
