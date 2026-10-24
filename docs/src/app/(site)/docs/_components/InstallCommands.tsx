import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bolerish/ui/tabs";

import { CodeBlock } from "./CodeBlock";

export function InstallCommands({ code }: { code: string }) {
  const commands = code.split("\n").map((command) => ({ manager: command.split(" ")[0], command }));
  return (
    <Tabs defaultValue="npm">
      <TabsList aria-label="Package manager">
        {commands.map(({ manager }) => (
          <TabsTrigger key={manager} value={manager}>
            {manager}
          </TabsTrigger>
        ))}
      </TabsList>
      {commands.map(({ manager, command }) => (
        <TabsContent key={manager} value={manager}>
          <CodeBlock code={command} language="bash" />
        </TabsContent>
      ))}
    </Tabs>
  );
}
