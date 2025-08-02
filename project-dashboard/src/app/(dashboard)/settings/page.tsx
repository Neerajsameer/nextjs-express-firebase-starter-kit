"use client";

import { CardActions, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between gap-4 flex-wrap">
        <div className="flex flex-col">
          <CardTitle>Settings</CardTitle>
        </div>
        <CardActions></CardActions>
      </div>
      <Separator className="my-4" />
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <p className="mt-4">Account settings go here.</p>
        </TabsContent>
        <TabsContent value="notifications">
          <p className="mt-4">Notification settings go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
