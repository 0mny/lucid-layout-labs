
import { Features } from "@/components/ui/features-11";
import { Features as AdvancedFeatures } from "@/components/ui/features";
import { Footer } from "@/components/ui/footer";
import Header from "@/components/Header";
import { Github, Twitter, Hexagon } from "lucide-react";

const Solutions = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Our Solutions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our advanced platform can transform your business operations with cutting-edge technology and seamless integrations.
          </p>
        </div>
      </div>
      
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

export default Solutions;
