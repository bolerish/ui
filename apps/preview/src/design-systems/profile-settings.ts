import type { StateStore } from "@json-render/core";
import { z } from "zod";

export const profileSettingsStateSchema = z.object({
  email: z.string(),
  notifications: z.boolean(),
  error: z.string(),
  pending: z.boolean(),
  failNext: z.boolean(),
  status: z.string(),
});
const emailSchema = z.email();

export function createProfileSettingsHandlers(store: StateStore) {
  const validate = () => {
    const valid = emailSchema.safeParse(store.get("/email")).success;
    store.set("/error", valid ? "" : "이메일 주소를 확인해주세요.");
    return valid;
  };
  return {
    validate,
    preference: () => {
      store.set(
        "/status",
        store.get("/notifications") ? "예제 알림을 켰어요." : "예제 알림을 껐어요.",
      );
    },
    failNextSave: () => {
      store.update({
        "/failNext": true,
        "/status": "다음 저장은 실패해요. 입력값을 보존하는지 확인해보세요.",
      });
    },
    save: async () => {
      if (store.get("/pending") || !validate()) return;
      const email = store.get("/email");
      const shouldFail = store.get("/failNext");
      store.update({ "/pending": true, "/status": "예제 이메일을 저장하고 있어요…" });
      try {
        await new Promise<void>((resolve) => setTimeout(resolve, 1500));
        if (shouldFail) throw new Error("예제 저장 실패");
        store.set("/status", `예제 저장을 마쳤어요: ${email}`);
      } catch {
        store.set("/status", "예제 저장에 실패했어요. 입력값은 그대로예요. 다시 저장해보세요.");
      } finally {
        store.update({ "/failNext": false, "/pending": false });
      }
    },
  };
}
