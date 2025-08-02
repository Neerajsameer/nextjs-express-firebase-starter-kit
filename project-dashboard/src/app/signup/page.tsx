"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { PasswordInput } from "@/components/ui/password-input";
import { API_URLS } from "@/constants/api_urls";
import { APP_IMAGES } from "@/constants/app_images";
import { useMobile } from "@/hooks/use-mobile";
import makeApiCall from "@/lib/api_wrapper";
import FirebaseAuth from "@/lib/firebase/firebaseAuthClass";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const [loginType, setLoginType] = useState<"phone" | "email" | "google" | "apple" | "microsoft" | null>(null);
  const firebaseAuth = useMemo(() => new FirebaseAuth(), []);
  const isMobile = useMobile();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const oauthSignUp = async (provider: "google" | "apple" | "microsoft") => {
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

  const emailSignup = async () => {
    if (!name) return toast.error("Please enter your name");
    if (!email) return toast.error("Please enter your email");
    if (!password) return toast.error("Please enter your password");
    if (password !== password2) return toast.error("Password do not match");

    try {
      setLoading(true);
      const user = await firebaseAuth.signUp(email, password);

      // Sync token with server
      await firebaseAuth.syncTokenWithServer();

      await makeApiCall({
        method: "POST",
        url: API_URLS.AUTH.SIGNUP,
        body: { name: name, email: user.email, uid: user.uid },
      });

      router.replace("/");
    } catch (error) {
      toast.error((error as any).message ?? "Something went wrong. Please try again");
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
            <p className="text-4xl font-bold">Sign Up</p>
            <p className="text-muted-foreground text-sm">Enter your email and password to sign up!</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => oauthSignUp("google")}
                size={"lg"}
                className="flex-1 min-w-[200px] w-full sm:w-auto"
              >
                <Image src={APP_IMAGES.google} alt="Google" width={20} height={20} className="mr-2" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                onClick={() => oauthSignUp("microsoft")}
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

          <Input value={name} label="Name" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
          <Input value={email} label="Email" placeholder="info@gmail.com" onChange={(e) => setEmail(e.target.value)} />

          <PasswordInput
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordInput
            label={"Re-Enter Password"}
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />

          <Button disabled={loading} size="lg" onClick={() => emailSignup()}>
            <Loader loading={loading} />
            Sign Up
          </Button>
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-semibold">
              {" "}
              Sign In
            </Link>
          </p>
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
