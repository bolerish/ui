import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bolerish/ui/tabs";
export default function States() {
  return (
    <Tabs defaultValue="account" variant="segmented">
      <TabsList aria-label="Account settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger disabled value="billing">
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="billing">Billing settings</TabsContent>
    </Tabs>
  );
}
