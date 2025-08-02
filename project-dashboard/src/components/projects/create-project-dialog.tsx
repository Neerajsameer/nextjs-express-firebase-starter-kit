import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_URLS } from "@/constants/api_urls";
import makeApiCall from "@/lib/api_wrapper";
import { useProjectsStore } from "@/store/projectsStore";
import { projects } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

function CreateProjectDialog({ isOpen, onClose, projectId }: CreateProjectDialogProps) {
  const [project, setProject] = useState({} as Partial<projects>);

  const { createProject, updateProject } = useProjectsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await makeApiCall({ url: API_URLS.PROJECTS.DETAIL(projectId), method: "GET" });
        setProject(response);
      } catch (error) {
        toast.error("Failed to fetch project details");
      }
    };

    setProject({});
    if (projectId && isOpen) fetchProject();
  }, [projectId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (project.name === "" || project.description === "") {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      if (projectId) {
        await updateProject(projectId, project);
        toast.success("Project updated successfully");
      } else {
        await createProject(project);
        toast.success("Project created successfully");
      }
      setProject({
        name: "",
        description: "",
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(projectId ? "Failed to update project" : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{projectId ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-scroll max-h-[70vh]">
          <Input
            id="name"
            label="Project Name"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            required
          />

          <Textarea
            id="description"
            value={project.description}
            label="Description"
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            className="h-20 resize-none mt-1"
            required
          />

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} onClick={handleSubmit}>
              {projectId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useCreateProjectDialog({ onUpdated }: { onUpdated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  const openCreateProjectDialog = useCallback((id?: string) => {
    setProjectId(id);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    onUpdated?.();
    setProjectId(undefined);
  }, []);

  const dialog = <CreateProjectDialog isOpen={isOpen} onClose={close} projectId={projectId} />;

  return { openCreateProjectDialog, CreateProjectDialog: dialog };
}
