import { create } from "zustand";
import { organisations, users } from "@prisma/client";
import makeApiCall from "@/lib/api_wrapper";
import FirebaseAuth from "@/lib/firebase/firebaseAuthClass";

export type AppState = {
  organisationId: string;
  user: (users & { organisations: organisations[] }) | null;
};

type AppActions = {
  getUser: () => Promise<void>;
  setOrganisationId: (id: string) => void;
};

const PAGE_SIZE = 20; // used for paginating and cursors

export const useUserStore = create<AppState & AppActions>((set, get) => ({
  user: null,
  organisationId: null as any, // Don't access localStorage here!
  setOrganisationId: (id) => {
    set({ organisationId: id });
    localStorage.setItem("org_id", id);
  },
  getUser: async () => {
    try {
      let orgId = localStorage.getItem("org_id") as string;

      const data = await makeApiCall({ url: "/user", method: "GET" });

      // Just in case, if the user is removed from org,
      if (!data.organisations.find((x: any) => x.id === orgId)) orgId = null as any;
      orgId = orgId ?? data.organisations[0].id;

      await fetch("/api/org/set-org", {
        method: "POST",
        body: JSON.stringify({ org_id: orgId }),
        headers: { "Content-Type": "application/json" },
      });

      set({ user: data, organisationId: orgId });

      localStorage.setItem("org_id", orgId);
    } catch (e) {
      const firebaseAuth = new FirebaseAuth();
      await firebaseAuth.signOut();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  },
}));
