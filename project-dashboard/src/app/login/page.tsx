"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { PasswordInput } from "@/components/ui/password-input";
import { API_URLS } from "@/constants/api_urls";
import { APP_IMAGES } from "@/constants/app_images";
import makeApiCall from "@/lib/api_wrapper";
import FirebaseAuth from "@/lib/firebase/firebaseAuthClass";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"phone" | "email" | "google" | "apple" | "microsoft" | null>(null);
  const firebaseAuth = useMemo(() => new FirebaseAuth(), []);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const oauthSignIn = async (provider: "google" | "apple" | "microsoft") => {
    setLoginType(provider);
    let user;

    try {
      if (provider === "apple") user = await firebaseAuth.signInWithApple();
      else if (provider === "microsoft") user = await firebaseAuth.signInWithMicrosoft();
      else user = await firebaseAuth.signInWithGoogle();

      // Sync token with server
      await firebaseAuth.syncTokenWithServer();

      await makeApiCall({
        method: "POST",
        url: API_URLS.AUTH.SOCIAL,
        body: {
          name: user.user.displayName,
          photo_url: user.user.photoURL,
          email: user.user.email,
          uid: user.user.uid,
        },
      });
    } catch (e) {
      toast.error(e as any);
    }

    router.replace("/");
  };

  const emailSigIn = async () => {
    if (!email) return toast.error("Please enter your email");
    if (!password) return toast.error("Please enter your password");
    setLoading(true);

    try {
      const user = await firebaseAuth.signIn(email, password);

      // Sync token with server
      await firebaseAuth.syncTokenWithServer();

      await makeApiCall({
        method: "POST",
        url: API_URLS.AUTH.LOGIN,
        body: { name: user.displayName, email: user.email, uid: user.uid },
      });
      // getUserData();
      router.replace("/");
    } catch (error) {
      toast.error((error as any).message);
      await firebaseAuth.signOut();
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col max-w-[500px] w-full gap-4">
          <div className="space-y-1">
            <Image className="mb-12" alt="Logo" src={APP_IMAGES.logo_white} height={200} width={250} />
            <p className="text-4xl font-bold">Sign In</p>
            <p className="text-muted-foreground text-sm">Enter your email and password to sign in!</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => oauthSignIn("google")}
                size={"lg"}
                className="flex-1 min-w-[200px] w-full sm:w-auto"
              >
                <Image src={APP_IMAGES.google} alt="Google" width={20} height={20} className="mr-2" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                onClick={() => oauthSignIn("microsoft")}
                size={"lg"}
                className="flex-1 min-w-[200px] w-full sm:w-auto"
              >
                <Image src={APP_IMAGES.microsoft} alt="Microsoft" width={20} height={20} className="mr-2" />
                Continue with Microsoft
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Input label="Email" placeholder="info@gmail.com" onChange={(e) => setEmail(e.target.value)} />

          <PasswordInput
            // label="Password"
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              className="w-fit"
              variant={"link"}
              size={"sm"}
              onClick={() => (window.location.href = "/forgot-password")}
            >
              Forgot Password?
            </Button>
          </div>

          <Button disabled={loading} size="lg" onClick={() => emailSigIn()}>
            <Loader loading={loading} />
            Login
          </Button>
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 font-semibold">
              {" "}
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div
        className="flex-1 bg-cover bg-center relative hidden md:flex"
        style={{ backgroundImage: `url(${APP_IMAGES.login_page})` }}
      >
        {theme.theme === "dark" && <div className="absolute top-0 left-0 w-full h-full z-1 bg-[rgba(0,0,0,0.45)]" />}
      </div>
    </div>
  );
}
