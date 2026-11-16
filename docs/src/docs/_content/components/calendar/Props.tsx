import { Calendar } from "@bolerish/ui/calendar";

export const propExamples = {
  fixedWeeks: {
    false: <Calendar defaultMonth={new Date(2026, 10, 1)} fixedWeeks={false} />,
    true: <Calendar defaultMonth={new Date(2026, 10, 1)} fixedWeeks={true} />,
  },
  mode: {
    single: <Calendar defaultMonth={new Date(2026, 10, 1)} mode="single" />,
    multiple: <Calendar defaultMonth={new Date(2026, 10, 1)} mode="multiple" />,
    range: <Calendar defaultMonth={new Date(2026, 10, 1)} mode="range" />,
  },
  numberOfMonths: {
    "1": <Calendar defaultMonth={new Date(2026, 10, 1)} numberOfMonths={1} />,
    "2": <Calendar defaultMonth={new Date(2026, 10, 1)} numberOfMonths={2} />,
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["fixedWeeks"]["false"]
    /* @example-end */
  );
}
