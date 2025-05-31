"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { oauthLogin } = useAuth();
  const { toast } = useToast();

  const handleSocialSignIn = async () => {
    try {
      setIsLoading(true);
      await oauthLogin();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to sign in with GitHub`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>

      <div className="max-w-xl mx-auto flex justify-center items-center">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialSignIn()}
          className="w-full"
        >
          <Github className="mr-2 h-4 w-4" />
          Sign up with GitHub
        </Button>
      </div>
    </div>
  );
}
