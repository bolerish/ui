import { Tabs, TabsList, TabsTrigger, TabsContent } from "@bolerish/ui/tabs";

export const propExamples = {
  variant: {
    segmented: (
      <Tabs defaultValue="overview" variant="segmented">
        <TabsList aria-label="Project views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Project overview</TabsContent>
        <TabsContent value="activity">Recent activity</TabsContent>
      </Tabs>
    ),
    underline: (
      <Tabs defaultValue="overview" variant="underline">
        <TabsList aria-label="Project views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Project overview</TabsContent>
        <TabsContent value="activity">Recent activity</TabsContent>
      </Tabs>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["variant"]["segmented"]
    /* @example-end */
  );
}
