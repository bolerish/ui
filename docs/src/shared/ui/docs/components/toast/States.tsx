import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";

export default function States() {
  const args = {
    position: "bottom-right" as const,
  };
  return (
    <>
      <Toaster
        {...args}
        clearAllProps={{
          children: "Dismiss all",
        }}
      />
      <>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Saved.",
              type: "success",
            })
          }
        >
          Save changes
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Update available.",
              type: "info",
            })
          }
        >
          View update
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Storage is running low.",
              type: "warning",
            })
          }
        >
          Manage storage
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Couldn’t save.",
              description: "Check your connection and try again.",
              priority: "high",
              type: "error",
            })
          }
        >
          Save again
        </Button>
      </>
    </>
  );
}
