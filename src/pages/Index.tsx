
import { HeroSection } from "@/components/ui/hero-section";
import { Features } from "@/components/ui/features";
import { Features as AdvancedFeatures } from "@/components/ui/features-11";
import { Footer } from "@/components/ui/footer";
import Header from "@/components/Header";
import { Github, Twitter, Hexagon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <Features />
      <AdvancedFeatures />
      <Footer
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Browse"
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "/solutions", label: "Solutions" },
          { href: "/pricing", label: "Pricing" },
          { href: "/about", label: "About" },
          { href: "/auth", label: "Sign In" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: "© 2024 Browse",
          license: "All rights reserved",
        }}
      />
    </div>
  );
};

export default Index;
