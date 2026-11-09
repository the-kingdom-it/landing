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

/*
 * Порядок секций на странице.
 * Убрать секцию — удали строку. Переставить — поменяй строки местами.
 * Если убираешь секцию из меню, удали и пункт в content.header.nav.
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
      <Header />
      <main id="main">
        {sections.map((Section, index) => (
          <Section key={index} />
        ))}
      </main>
      <Footer />
    </>
  );
}
