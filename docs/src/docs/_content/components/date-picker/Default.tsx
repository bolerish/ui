import { DatePicker } from "@bolerish/ui/date-picker";
import { useState } from "react";
export default function Default() {
  /* @example-start */
  const [date, setDate] = useState<Date | undefined>();
  /* @example-end */

  return (
    /* @example-start */
    <DatePicker value={date} onValueChange={setDate} />
    /* @example-end */
  );
}
