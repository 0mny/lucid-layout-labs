
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Footer } from "@/components/ui/footer";
import { Github, Twitter, Hexagon, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About Tailark</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to revolutionize how teams collaborate and manage their projects with innovative technology solutions.
          </p>
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
