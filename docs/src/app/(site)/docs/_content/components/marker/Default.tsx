import { Marker, MarkerContent, MarkerIcon } from "@bolerish/ui/marker";
import { Spinner } from "@bolerish/ui/spinner";
export default function Default() {
  return (
    <Marker>
      <MarkerIcon>
        <Spinner label="Writing a reply" />
      </MarkerIcon>
      <MarkerContent>Writing a reply.</MarkerContent>
    </Marker>
  );
}
