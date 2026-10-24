import { Button } from "@bolerish/ui/button";
import { toast, Toaster } from "@bolerish/ui/toast";

export default function MultipleNotifications() {
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
      <Button
        variant="secondary"
        onClick={() => {
          for (const notification of [
            ["Design review started.", "Leave feedback by 3 PM today."],
            ["New comment.", "Minji reviewed the changes."],
            ["Task assigned.", "Landing-page improvements start tomorrow."],
          ]) {
            toast.add({
              title: notification[0],
              description: notification[1],
              timeout: 0,
            });
          }
        }}
      >
        Add three notifications
      </Button>
    </>
  );
}
