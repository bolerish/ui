import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import {
  XIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretUpDownIcon,
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  WarningIcon,
  InfoIcon,
  CalendarIcon,
  ClockIcon,
  ArrowSquareOutIcon,
  ListIcon,
  DotsThreeIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsDownUpIcon,
  FunnelIcon,
  EyeSlashIcon,
  ColumnsIcon,
  CopyIcon,
  ChecksIcon,
  WrenchIcon,
  StopIcon,
  MicrophoneIcon,
  FolderIcon,
  FileIcon,
  PaperclipIcon,
  DownloadSimpleIcon,
  GitBranchIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
const icons = {
  XIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretUpDownIcon,
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  WarningIcon,
  InfoIcon,
  CalendarIcon,
  ClockIcon,
  ArrowSquareOutIcon,
  ListIcon,
  DotsThreeIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsDownUpIcon,
  FunnelIcon,
  EyeSlashIcon,
  ColumnsIcon,
  CopyIcon,
  ChecksIcon,
  WrenchIcon,
  StopIcon,
  MicrophoneIcon,
  FolderIcon,
  FileIcon,
  PaperclipIcon,
  DownloadSimpleIcon,
  GitBranchIcon,
};
const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space6,
    padding: 0,
  },
  grid: {
    display: "grid",
    gap: spacingVars.space3,
    gridTemplateColumns: "repeat(auto-fill, minmax(8rem, 1fr))",
  },
  item: {
    alignItems: "center",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space3,
    padding: spacingVars.space4,
  },
  name: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
  },
});
export function Icons() {
  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.grid)}>
        {Object.entries(icons).map(([name, Icon]) => (
          <div key={name} {...stylex.props(styles.item)}>
            <Icon aria-hidden="true" size={24} />
            <span {...stylex.props(styles.name)}>{name}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
