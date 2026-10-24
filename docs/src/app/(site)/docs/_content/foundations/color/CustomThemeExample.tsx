import { Button } from "@bolerish/ui/button";
import * as stylex from "@stylexjs/stylex";

import { brand } from "./brand.stylex";

export default function CustomThemeExample() {
  return (
    <div {...stylex.props(brand)}>
      <Button>Custom brand action</Button>
    </div>
  );
}
