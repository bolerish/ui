import { DatePicker } from "@bolerish/ui/date-picker";
import { useState } from "react";
export default function Default() {
  const [date, setDate] = useState<Date | undefined>();
  return <DatePicker value={date} onValueChange={setDate} />;
}
