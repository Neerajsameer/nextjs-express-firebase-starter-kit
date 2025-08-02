import FirebaseAuth from "@/lib/firebase/firebaseAuthClass";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export default function EmailVerificationAlert() {
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => {
    async function getUser() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const firebaseAuth = new FirebaseAuth();
      const user = firebaseAuth.getCurrentUser();

      setEmailVerified(user?.emailVerified ?? true);
    }

    getUser();
  }, []);

  if (emailVerified) return <></>;

  return (
    <Alert variant="warning">
      <InformationCircleIcon />
      <AlertTitle>Email Verification Required</AlertTitle>
      <AlertDescription>
        Please verify your email address to access all features of your account.
        <Button
          variant={"outline"}
          className="mt-2"
          onClick={async () => {
            await new FirebaseAuth().sendEmailVerificationLink();
            toast.info("Verification email has been sent to your email");
          }}
        >
          Send Email verification Link
        </Button>
      </AlertDescription>
    </Alert>
  );
}
