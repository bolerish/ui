import { Button } from "@bolerish/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@bolerish/ui/dropdown-menu";

export const propExamples = {
  align: {
    start: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    center: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent align="center">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    end: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  destructive: {
    false: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem destructive={false}>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    true: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem destructive={true}>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  disabled: {
    false: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem disabled={false}>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    true: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem disabled={true}>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  inset: {
    false: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem inset={false}>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    true: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem inset={true}>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  side: {
    top: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent side="top">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    right: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent side="right">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    bottom: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent side="bottom">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    left: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent side="left">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    "inline-start": (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent side="inline-start">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    "inline-end": (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary">Actions</Button>} />
        <DropdownMenuContent side="inline-end">
          <DropdownMenuItem>Delete project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
