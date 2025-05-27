"use client";
import { Code, MessageSquare, Github } from "@/components/ui/icons";

const features = [
  {
    icon: Github,
    title: "GitHub Integration",
    description:
      "Seamlessly connect your repositories and access your codebase directly from the app.",
  },
  {
    icon: Code,
    title: "Intelligent Analysis",
    description:
      "AI-powered reviews that go beyond syntax checking to analyze logic, patterns, and best practices.",
  },
  {
    icon: MessageSquare,
    title: "Actionable Feedback",
    description:
      "Get detailed, contextual suggestions to improve code quality and maintainability.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="features-section py-24 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Intelligent Code Analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover issues, improve quality, and learn best practices with
            every review.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-8 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-500 hover:border-border hover:shadow-xl hover:-translate-y-2"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary transition-colors" />
                </div>

                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
