"use client";

import { useCreateProjectDialog } from "@/components/projects/create-project-dialog";
import EmptyState from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardActions, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_IMAGES } from "@/constants/app_images";
import { getBadgeVariant } from "@/lib/utils";
import { useProjectsStore } from "@/store/projectsStore";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Projects() {
  const { projects, getProjects, loading } = useProjectsStore();
  const { openCreateProjectDialog, CreateProjectDialog } = useCreateProjectDialog({});
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between gap-4 flex-wrap">
        <div className="flex flex-col">
          <CardTitle>Projects</CardTitle>
          <CardDescription>View, search, and manage all your projects from one place.</CardDescription>
        </div>
        <CardActions>
          <Input
            placeholder="Search Projects..."
            prefixIcon={<MagnifyingGlassIcon />}
            className="w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <Button variant={"outline"} size={"icon"}>
              <FunnelIcon />
            </Button> */}

          <Button onClick={() => openCreateProjectDialog()}>
            <PlusCircleIcon />
            Create
          </Button>
        </CardActions>
      </div>
      <Separator className="my-4" />

      <div className="h-full">
        {filteredProjects.length === 0 && !loading && !searchQuery && (
          <EmptyState
            btnText="Create Project"
            description="Get started by creating your first project."
            title="No Projects Yet"
            image={APP_IMAGES.illustrations.no_projects}
            onClick={() => openCreateProjectDialog()}
            imageAlt="No Projects"
          />
        )}
        {searchQuery && filteredProjects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No projects found matching your search.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 overflow-y-scroll">
          {filteredProjects.length == 0 &&
            loading &&
            [1, 2, 3, 4, 5, 6].map((x, i) => <Skeleton key={i} className="h-36 w-full" />)}
          {filteredProjects.map((project, index) => (
            <Link href={`/projects/${project.id}`} key={index} className="h-full">
              <Card onClick={() => router.push("")} className="flex flex-col h-full">
                <CardContent className="flex flex-col flex-1 justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                      <Badge variant={getBadgeVariant(project.status)}>{project.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {CreateProjectDialog}
    </div>
  );
}
