import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { SuccessStories } from "@/components/landing/SuccessStories";
import { Process } from "@/components/landing/Process";
import { Pricing } from "@/components/landing/Pricing";
import { Contacts } from "@/components/landing/Contacts";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <SuccessStories />
        <Process />
        <Pricing />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
