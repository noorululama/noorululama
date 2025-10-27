import AboutSection from "@/components/sectons/AboutSection";
import CTASection from "@/components/sectons/CTASection";
import HeroSection from "@/components/sectons/HeroSection";
import StatsSection from "@/components/sectons/StatsSection";
import TestimonialsSection from "@/components/sectons/TestimonialsSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Noorul Ulama - Islamic Excellence & Education",
  description: "Welcome to Noorul Ulama Students Association at Jamia Nooriyya Arabiyya Pattikkad. Join us in our journey of Islamic education, cultural preservation, and community service.",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection/>
      <AboutSection/>
      <StatsSection/>
      <TestimonialsSection/>
      <CTASection/>
      
      
    </main>
  );
}
