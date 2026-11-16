import { sizeVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import {
  Collapsible,
  CollapsibleContent,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@bolerish/ui/collapsible";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@bolerish/ui/item";
import * as stylex from "@stylexjs/stylex";

export default function Default() {
  return (
    <Collapsible defaultOpen xstyle={styles.root}>
      <div {...stylex.props(styles.header)}>
        <strong>Order #4189</strong>
        <CollapsibleTrigger aria-label="Toggle order details" />
      </div>
      <Item variant="outline">
        <ItemContent>
          <ItemDescription>Status</ItemDescription>
        </ItemContent>
        <ItemTitle>Shipped</ItemTitle>
      </Item>
      <CollapsiblePanel>
        <CollapsibleContent>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Shipping address</ItemTitle>
              <ItemDescription>100 Market St, San Francisco</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Items</ItemTitle>
              <ItemDescription>2× Studio Headphones</ItemDescription>
            </ItemContent>
          </Item>
        </CollapsibleContent>
      </CollapsiblePanel>
    </Collapsible>
  );
}

const styles = stylex.create({
  root: { maxWidth: sizeVars.contentSm },
  header: {
    alignItems: "center",
    display: "flex",
    gap: spacingVars.space2,
    justifyContent: "space-between",
  },
});
