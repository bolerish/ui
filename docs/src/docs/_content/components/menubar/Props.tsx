import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@bolerish/ui/menubar";

export const propExamples = {
  align: {
    start: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent align="start">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    center: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent align="center">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    end: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent align="end">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
  },
  side: {
    top: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent side="top">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    right: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent side="right">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    bottom: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent side="bottom">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    left: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent side="left">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    "inline-start": (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent side="inline-start">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    "inline-end": (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent side="inline-end">
            <MenubarItem>New document</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["align"]["start"]
    /* @example-end */
  );
}
