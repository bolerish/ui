import { createRoot } from "react-dom/client";

import BrandThemeExample from "../../../../docs/src/app/(site)/docs/_content/foundations/color/BrandThemeExample";
import CustomThemeExample from "../../../../docs/src/app/(site)/docs/_content/foundations/color/CustomThemeExample";
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

import "../../dist/global.css";

const params = new URLSearchParams(location.search);
const fixture = params.get("fixture");
document.documentElement.className =
  themeClassNames[
    params.get("theme") === "ocean" ? "ocean" : params.get("theme") === "dark" ? "dark" : "light"
  ];
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
  if (fixture === "brand")
    return (
      <main>
        <h1>Brand theme</h1>
        <BrandThemeExample />
        <CustomThemeExample />
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
