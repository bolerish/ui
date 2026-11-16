import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxList,
  ComboboxCollection,
  ComboboxItem,
  ComboboxEmpty,
} from "@bolerish/ui/combobox";

export const propExamples = {
  align: {
    start: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup align="start">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    center: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup align="center">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    end: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup align="end">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
  },
  disabled: {
    false: (
      <Combobox items={["React", "Vue", "Svelte"]} disabled={false}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    true: (
      <Combobox items={["React", "Vue", "Svelte"]} disabled={true}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
  },
  side: {
    top: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup side="top">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    right: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup side="right">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    bottom: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup side="bottom">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    left: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup side="left">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    "inline-start": (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup side="inline-start">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    "inline-end": (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" />
        <ComboboxPopup side="inline-end">
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
  },
  variant: {
    outline: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" variant="outline" />
        <ComboboxPopup>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
    inline: (
      <Combobox items={["React", "Vue", "Svelte"]}>
        <ComboboxInput aria-label="Framework" variant="inline" />
        <ComboboxPopup>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["align"]["start"]
    /* @example-end */
  );
}
