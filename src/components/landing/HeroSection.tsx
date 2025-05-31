"use client";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute z-20 inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 " />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,background_70%)] " />

      {/* Content */}
      <div className="hero-content max-w-4xl mx-auto text-center space-y-8 relative z-30">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="text-foreground">Code Reviews</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get instant, intelligent feedback on your code. Connect your GitHub
            repository and let AI analyze your files for quality, bugs, and best
            practices.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => {
              if (user) {
                router.push("/dashboard");
              } else {
                router.push("/signup");
              }
            }}
            className="group text-base px-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            {!user && <Github className="mr-2 h-5 w-5" />}
            {user ? "Dashboard" : "Get Started"}
          </Button>

          {/* <Button variant="outline" size="lg" className="text-base px-8">
            View Demo
          </Button> */}
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border/40">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              10k+
            </div>
            <div className="text-sm text-muted-foreground">Files Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              500+
            </div>
            <div className="text-sm text-muted-foreground">Developers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              99%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
