"use client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { APP_IMAGES } from "@/constants/app_images";
import FirebaseAuth from "@/lib/firebase/firebaseAuthClass";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const firebaseAuth = useMemo(() => new FirebaseAuth(), []);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  async function resetPassword() {
    if (!email) return toast.error("Please enter your email");
    try {
      setLoading(true);
      await firebaseAuth.sendResetPasswordEmail(email);
      setIsSent(true);
      setLoading(false);
    } catch (e) {
      toast.error("Oops! Something went wrong. Contact support");
    }
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col max-w-[500px] w-full gap-4">
          <div className="space-y-1">
            <Image className="mb-12" alt="Logo" src={APP_IMAGES.logo_white} height={200} width={250} />

            <p className="text-4xl font-bold">Forgot Your Password?</p>
            <p className="text-muted-foreground text-sm">
              Enter the email address linked to your account, and we’ll send you a link to reset your password.
            </p>
          </div>

          {isSent && (
            <>
              <div className="mb-2 flex flex-col">
                <Alert variant="success">
                  <CheckCircleIcon />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>A password reset link has been sent to your email.</AlertDescription>
                </Alert>
                <Button className="mt-4 w-fit" variant={"link"} onClick={() => (window.location.href = "/login")}>
                  Go back to login
                </Button>
              </div>
            </>
          )}

          {!isSent && (
            <>
              <Input label="Email" placeholder="info@gmail.com" onChange={(e) => setEmail(e.target.value)} />
              <Button disabled={loading} size="lg" onClick={() => resetPassword()}>
                <Loader loading={loading} />
                Send Reset Link
              </Button>
              <p className="text-sm">
                Wait, I remember my password...{" "}
                <Link href="/login" className="text-blue-500 font-semibold">
                  {" "}
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <div
        className="flex-1 bg-cover bg-center relative hidden md:flex"
        style={{ backgroundImage: `url(${APP_IMAGES.login_page})` }}
      >
        <div className="absolute top-0 left-0 w-full h-full z-1 bg-[rgba(0,0,0,0.45)]" />
      </div>
    </div>
  );
}
