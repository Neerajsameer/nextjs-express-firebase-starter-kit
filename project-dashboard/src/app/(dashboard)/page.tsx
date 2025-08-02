"use client";

import EmailVerificationAlert from "@/components/misc/EmailVerificationAlert";

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col">
      <EmailVerificationAlert />
    </div>
  );
}
