import { Audience } from "@/components/sections/Audience";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Referral } from "@/components/sections/Referral";
import { Team } from "@/components/sections/Team";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Particles } from "@/components/theme/Particles";
import { Scene } from "@/components/theme/Scene";

/*
 * Порядок секций на странице.
 * Убрать секцию — удали строку. Переставить — поменяй строки местами.
 * Если на секцию ведут ссылки (поиск по "#id" в content.ts: меню, кнопки), поправь их —
 * `npm test` покажет все ссылки, которые остались без цели.
 */
const sections = [
  Hero,
  Audience,
  Process,
  Pricing,
  Team,
  Referral,
  Faq,
  Cta,
];

export default function Home() {
  return (
    <>
      <Scene />
      <Particles />
      <Header />
      <main id="main">
        {sections.map((Section, index) => (
          <Section key={index} />
        ))}
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
