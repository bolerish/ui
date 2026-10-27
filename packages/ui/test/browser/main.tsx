import * as stylex from "@stylexjs/stylex";
import { createRoot } from "react-dom/client";

import InputVariants from "../../../../docs/src/app/(site)/docs/_content/components/input/Variants";
import { Button } from "../../dist/button.js";
import { Card, CardContent, CardDescription } from "../../dist/card.js";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxList,
  ComboboxCollection,
  ComboboxItem,
} from "../../dist/combobox.js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../dist/dialog.js";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "../../dist/drawer.js";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../dist/dropdown-menu.js";
import { Input } from "../../dist/input.js";
import { Liquid } from "../../dist/liquid.js";
import { Popover, PopoverTrigger, PopoverContent } from "../../dist/popover.js";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectList,
  SelectItem,
} from "../../dist/select.js";
import { themeClassNames } from "../../dist/theme.js";
import { Toaster, toast } from "../../dist/toast.js";
import { DocumentationExample } from "./documentation-examples";
import { brandColors, brandShadows } from "./theme.stylex";

import "../../dist/global.css";

const params = new URLSearchParams(location.search);
const fixture = params.get("fixture");
document.documentElement.dataset.bolerishTheme = params.get("theme") === "dark" ? "dark" : "light";
if (params.has("legacyTheme")) {
  document.documentElement.className =
    themeClassNames[params.get("theme") === "dark" ? "dark" : "light"];
  delete document.documentElement.dataset.bolerishTheme;
}
if (params.has("customTheme"))
  document.documentElement.className = stylex.props(brandColors, brandShadows).className ?? "";
document.documentElement.dataset.bolerishMotion = "off";
if (params.has("surface"))
  document.documentElement.dataset.bolerishSurface = params.get("surface")!;
const options = ["React", "Vue", "Svelte"];
function SelectExample() {
  return (
    <Select items={Object.fromEntries(options.map((value) => [value, value]))}>
      <SelectTrigger aria-label="Framework">
        <SelectValue placeholder="Choose framework" />
      </SelectTrigger>
      <SelectPopup>
        <SelectList>
          {options.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectList>
      </SelectPopup>
    </Select>
  );
}
function ComboboxExample() {
  return (
    <Combobox items={options}>
      <ComboboxInput
        aria-label="Framework"
        triggerLabel="옵션 열기"
        {...(params.has("noAddons") ? { startAddon: null, endAddon: null } : {})}
      />
      <ComboboxPopup>
        <ComboboxList>
          <ComboboxCollection>
            {(value: string) => (
              <ComboboxItem key={value} value={value}>
                {value}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Open dialog</Button>} />
      <DialogContent>
        <DialogTitle>Edit project</DialogTitle>
        <DialogDescription>Change the project name.</DialogDescription>
        <input aria-label="Project name" />
        <button>Save</button>
      </DialogContent>
    </Dialog>
  );
}
function App() {
  if (fixture === "liquid")
    return (
      <main>
        <h1>Liquid measurement</h1>
        <Liquid
          data-testid="liquid"
          style={{ width: 240, height: 160 }}
          background={
            <svg width="100%" height="100%" viewBox="0 0 240 160" preserveAspectRatio="none">
              {Array.from({ length: 40 }, (_, index) => (
                <rect
                  key={index}
                  x={index * 6}
                  width="6"
                  height="160"
                  fill={index % 2 ? "#3b82f6" : "#ef4444"}
                />
              ))}
            </svg>
          }
        >
          <div style={{ paddingBlock: 48, paddingInline: 4 }}>
            <span
              data-testid="foreground-label"
              style={{
                position: "absolute",
                left: 2,
                top: 20,
                background: "Canvas",
                color: "CanvasText",
              }}
            >
              Sharp
            </span>
            <Button
              onClick={(event) => {
                event.currentTarget.textContent = "Selected";
              }}
            >
              Choose
            </Button>
          </div>
        </Liquid>
      </main>
    );
  if (fixture === "input-variants")
    return (
      <main>
        <h1>Input variants</h1>
        <InputVariants />
        <Input aria-label="Invalid none" variant="none" aria-invalid defaultValue="Invalid" />
        <Input
          aria-label="Invalid underline"
          variant="underline"
          aria-invalid
          defaultValue="Invalid"
        />
        <Input aria-label="Required none" variant="none" required />
        <Input aria-label="Required underline" variant="underline" required />
        <Input aria-label="Disabled none" variant="none" disabled defaultValue="Disabled" />
        <Input
          aria-label="Disabled underline"
          variant="underline"
          disabled
          defaultValue="Disabled"
        />
      </main>
    );
  if (fixture === "documentation") return <DocumentationExample name={params.get("example")!} />;
  if (fixture === "select") return <SelectExample />;
  if (fixture === "combobox") return <ComboboxExample />;
  if (fixture === "menu")
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button>Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  if (fixture === "drawer")
    return (
      <Drawer>
        <DrawerTrigger render={<Button>Open drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Move project</DrawerTitle>
          <DrawerDescription>Choose a folder.</DrawerDescription>
          <input aria-label="Folder" />
        </DrawerContent>
      </Drawer>
    );
  if (fixture === "surface")
    return (
      <div style={{ background: "#80414b", padding: 32 }}>
        <Card data-testid="surface">
          <CardContent>
            <p>Primary text</p>
            <CardDescription data-testid="description">Supporting text</CardDescription>
            <Input aria-label="Surface field" />
            <DialogExample />
          </CardContent>
        </Card>
      </div>
    );
  if (fixture === "toast")
    return (
      <>
        <Toaster closeLabel="알림 닫기" />
        <Button
          onClick={() =>
            toast.add({
              title: "First notification",
              timeout: 0,
              type: params.get("type") ?? undefined,
            })
          }
        >
          Add first
        </Button>
        <Button onClick={() => toast.add({ title: "Second notification", timeout: 0 })}>
          Add second
        </Button>
        <input aria-label="Editor" />
        <button
          onKeyDown={(e) => {
            if (e.key === "Escape") e.preventDefault();
          }}
        >
          Handled action
        </button>
        <DialogExample />
        <Popover>
          <PopoverTrigger render={<Button>Open popover</Button>} />
          <PopoverContent>
            <input aria-label="Popover field" />
          </PopoverContent>
        </Popover>
        <SelectExample />
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button>Actions</Button>} />
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  return <DialogExample />;
}
createRoot(document.getElementById("root")!).render(<App />);
