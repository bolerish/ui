import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bolerish/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bolerish/ui/tabs";
import * as stylex from "@stylexjs/stylex";
const layout = stylex.create({
  preview: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space3,
    lineHeight: typo.lineHeightNormal,
    justifyContent: "center",
    width: "100%",
  },
  column: {
    alignItems: "stretch",
    flexDirection: "column",
  },
});
function TabsExample() {
  return (
    <div {...stylex.props(layout.preview, layout.column)}>
      <Tabs defaultValue="overview" variant="segmented">
        <TabsList aria-label="Project sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View key metrics and recent activity across your active projects.
              </CardDescription>
            </CardHeader>
            <CardContent>You have 12 active projects and 3 pending tasks.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Review trends across your projects and identify work that needs attention.
              </CardDescription>
            </CardHeader>
            <CardContent>Project activity increased 18% this week.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Create and share progress reports with your team.</CardDescription>
            </CardHeader>
            <CardContent>Your weekly report is ready to review.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage notifications and preferences for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>Notifications are enabled for project updates.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default function Variants() {
  return <TabsExample />;
}
