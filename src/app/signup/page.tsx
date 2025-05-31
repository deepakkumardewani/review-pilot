import SignUpForm from "@/components/auth/SignUpForm";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-50 dark:bg-neutral-950">
        <div className="flex justify-center mb-1">
          <Image
            src="/assets/icon.png"
            alt="PortfolioGen Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
