import { Calendar } from "@bolerish/ui/calendar";
import { useState } from "react";
export default function Default() {
  /* @example-start */
  const [date, setDate] = useState<Date | undefined>(() => new Date());
  /* @example-end */

  return (
    /* @example-start */
    <Calendar mode="single" selected={date} onSelect={setDate} fixedWeeks />
    /* @example-end */
  );
}
