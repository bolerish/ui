import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";

export default function Actions() {
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
          onClick={() => {
            const id = toast.add({
              title: "Moved to archive.",
              description: "You can restore this item with Undo.",
              timeout: 0,
              actionProps: {
                children: "Undo",
                onClick: () => toast.close(id),
              },
            });
          }}
        >
          Undo archive
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(new Promise((resolve) => window.setTimeout(resolve, 1200)), {
              loading: {
                title: "Saving changes.",
                type: "loading",
              },
              success: {
                title: "Changes saved.",
                type: "success",
              },
              error: {
                title: "Couldn’t save changes.",
                type: "error",
              },
            })
          }
        >
          Start saving
        </Button>
      </>
    </>
  );
}
