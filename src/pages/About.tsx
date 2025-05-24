
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Github, Twitter, Hexagon, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About Tailark</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to revolutionize how teams collaborate and manage their projects with innovative technology solutions.
          </p>
        </div>

        {/* Manifesto Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Why We're Building Browse: A Manifesto</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p>
                The promise of AI was simple: technology that works with us, not against us. Technology that understands what we want and makes it happen. Instead, we got chat boxes.
              </p>
              <p>
                For decades, we've been training ourselves to speak computer language—learning shortcuts, memorizing commands, clicking through endless menus. We adapted to machines instead of machines adapting to us. The rise of AI was supposed to change this. Finally, we thought, computers that could understand human intent and act on it naturally.
              </p>
              <p>
                But look around. The AI revolution gave us more apps to manage, more interfaces to learn, more fragmented tools that require us to context-switch constantly. We're still the ones doing the work—copying, pasting, translating between systems. AI became another layer of complexity, not the simplification we desperately needed.
              </p>
              <p className="font-semibold text-foreground">
                We're building Browse because we believe in the original promise.
              </p>
              <p>
                Your computer should work like a capable assistant, not a collection of disconnected tools. When you speak, it should understand not just your words but your context—what's on your screen, what you're trying to accomplish, how you prefer to work. It should execute tasks across all your applications seamlessly, privately, and immediately.
              </p>
              <p>
                The future isn't about having smarter chat bots. It's about having computers that finally understand us well enough to work the way we think. Voice-controlled, screen-aware, contextually intelligent. An extension of your intent, not another obstacle to it.
              </p>
              <p className="font-semibold text-foreground">
                Browse isn't just software—it's how human-computer interaction should have worked from the beginning.
              </p>
              <p>
                We're not building another AI tool. We're building the bridge between human intention and digital execution. Because technology should amplify human capability, not require us to become more like machines.
              </p>
              <p className="font-bold text-foreground text-lg">
                The age of adapting to our computers is over. The age of computers that adapt to us starts now.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Our Team</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A diverse group of passionate developers, designers, and strategists working together to build the future.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Our Mission</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To empower teams worldwide with tools that simplify complex workflows and enhance productivity.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Our Values</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Innovation, transparency, and customer success drive everything we do at Tailark.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Founded in 2020, Tailark began as a small startup with a big vision: to create software that makes work more human and less complicated.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Today, we serve thousands of teams across the globe, helping them achieve their goals with our comprehensive suite of tools and integrations.
            </p>
            <p className="text-lg text-muted-foreground">
              We're just getting started, and we're excited to continue growing alongside our community of users.
            </p>
          </div>
        </div>
      </div>

      <Footer
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Tailark"
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
          { href: "/products", label: "Products" },
          { href: "/about", label: "About" },
          { href: "/blog", label: "Blog" },
          { href: "/contact", label: "Contact" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: "© 2024 Tailark",
          license: "All rights reserved",
        }}
      />
    </div>
  );
};

export default About;
