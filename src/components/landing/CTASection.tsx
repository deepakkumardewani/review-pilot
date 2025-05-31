"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <section className="cta-section py-24 px-4 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] -z-10"></div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="cta-content space-y-8 p-12 rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 border border-border/50 shadow-2xl relative backdrop-blur-sm">
          {/* Subtle glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent opacity-50 -z-10" />

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Improve Your Code?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in seconds with your GitHub account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => {
                if (user) {
                  router.push("/dashboard");
                } else {
                  router.push("/signup");
                }
              }}
            >
              {/* <Github className="mr-2 h-5 w-5" /> */}
              {user ? "Dashboard" : "Get Started"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
