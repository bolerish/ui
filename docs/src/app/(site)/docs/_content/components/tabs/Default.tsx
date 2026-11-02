import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bolerish/ui/tabs";
export default function Default() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">You have 12 active projects and 3 pending tasks.</TabsContent>
      <TabsContent value="analytics">Review project analytics.</TabsContent>
      <TabsContent value="reports">Download project reports.</TabsContent>
      <TabsContent value="settings">Manage project settings.</TabsContent>
    </Tabs>
  );
}
