import { API_URLS } from "@/constants/api_urls";
import makeApiCall from "@/lib/api_wrapper";
import { projects } from "@prisma/client";
import { create } from "zustand";

export type AppState = {
  projects: projects[];
  projectDetailed: projects | null;
  loading: boolean;
};

type AppActions = {
  getProjects: () => Promise<projects[]>;
  getProject: (id: string) => Promise<projects>;
  createProject: (project: Partial<projects>) => Promise<void>;
  updateProject: (projectId: string, project: Partial<projects>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
};

const PAGE_SIZE = 20; // used for paginating and cursors

export const useProjectsStore = create<AppState & AppActions>((set, get) => ({
  loading: false,
  projects: [],
  projectDetailed: null,
  getProjects: async () => {
    set({ loading: true });
    const data = await makeApiCall({
      url: API_URLS.PROJECTS.BASE,
      method: "GET",
    });
    set({ projects: data, loading: false });
    return data;
  },
  getProject: async (id) => {
    set({ loading: true, projectDetailed: null });
    try {
      const data = await makeApiCall({ url: API_URLS.PROJECTS.DETAIL(id), method: "GET" });
      set({ projectDetailed: data, loading: false });
      return data;
    } catch (e) {
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (project) => {
    await makeApiCall({
      url: API_URLS.PROJECTS.BASE,
      method: "POST",
      body: project,
    });

    get().getProjects();
  },
  updateProject: async (projectId, project) => {
    await makeApiCall({
      url: API_URLS.PROJECTS.DETAIL(projectId),
      method: "PUT",
      body: project,
    });

    get().getProjects();
  },
  deleteProject: async (projectId) => {
    await makeApiCall({
      url: API_URLS.PROJECTS.DETAIL(projectId),
      method: "DELETE",
    });

    get().getProjects();
  },
}));
