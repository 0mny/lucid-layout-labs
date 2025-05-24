
import { Features } from "@/components/ui/features-11";
import { Features as AdvancedFeatures } from "@/components/ui/features";
import { Footer } from "@/components/ui/footer";
import Header from "@/components/Header";
import { Github, Twitter, Hexagon } from "lucide-react";

const Solutions = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-20 mt-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Desktop AI, Finally Done Right</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Browse represents a fundamentally different approach to workplace AI. Instead of adding another app to your stack, we built an intelligent overlay that works across every app you already use.
          </p>
          <div className="max-w-3xl mx-auto text-left space-y-6">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Traditional AI Workflow:</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Describe task to AI</li>
                <li>Get suggestions/draft</li>
                <li>Copy output</li>
                <li>Paste into actual app</li>
                <li>Manual editing and execution</li>
              </ol>
            </div>
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-3">Browse Workflow:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Tell Browse what you need</li>
                <li>Watch it happen</li>
              </ol>
              <p className="mt-4 font-medium">Same intelligence, zero friction.</p>
            </div>
          </div>
        </div>
      </div>
      
      <AdvancedFeatures />
      <Features />
      
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
