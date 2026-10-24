import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bolerish/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bolerish/ui/tabs";
export default function Default() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>View key metrics and recent activity.</CardDescription>
          </CardHeader>
          <CardContent>You have 12 active projects and 3 pending tasks.</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
