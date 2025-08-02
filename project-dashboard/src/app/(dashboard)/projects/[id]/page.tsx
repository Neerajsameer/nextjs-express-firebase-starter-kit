"use client";

import { useDeleteDialog } from "@/components/misc/delete-dialog";
import { useCreateProjectDialog } from "@/components/projects/create-project-dialog";
import PageBreadcrumbs from "@/components/shared/PageBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getBadgeVariant } from "@/lib/utils";
import { useProjectsStore } from "@/store/projectsStore";
import {
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Projects() {
  const { projectDetailed: project, loading, getProject, deleteProject } = useProjectsStore();
  const projectId = useParams().id as string;
  const { CreateProjectDialog, openCreateProjectDialog } = useCreateProjectDialog({
    onUpdated: () => getProject(projectId),
  });
  const { showDeleteDialog, DeleteDialogComponent } = useDeleteDialog();
  const router = useRouter();

  useEffect(() => {
    getProject(projectId);
  }, []);

  if (loading) return <></>;
  if (!project && !loading) return <>Project Not found</>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <PageBreadcrumbs links={[{ text: "Projects", link: "/projects" }, { text: project!.name }]} />

        <div className="flex shrink-0 gap-2">
          <Button
            variant={"destructive"}
            onClick={async () => {
              const canDelete = await showDeleteDialog();
              if (canDelete) {
                await deleteProject(projectId);
                router.replace("/projects");
              }
            }}
          >
            <TrashIcon />
            Delete
          </Button>
          <Button onClick={() => openCreateProjectDialog(projectId)}>
            <PencilIcon />
            Edit
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <div className="grow flex flex-col space-y-2">
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">{project?.name}</p>
                <Badge size="sm" variant={getBadgeVariant(project?.status)}>
                  {project?.status}
                </Badge>
              </div>
              <p className="mb-4 mt-1">{project?.description}</p>
              <div className="text-sm text-muted-foreground flex gap-2 md:gap-6 flex-col md:flex-row">
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="size-4" />
                  <p> Created on {formatDate(project?.created_at)} </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {CreateProjectDialog}
      {DeleteDialogComponent}
    </div>
  );
}
