import { Calendar } from "@bolerish/ui/calendar";
import { useState } from "react";
export default function Default() {
  const [date, setDate] = useState<Date | undefined>();
  return <Calendar mode="single" selected={date} onSelect={setDate} fixedWeeks />;
}
