import { useSelector } from "react-redux";
import { RootState } from "../store";
import { colors } from "../core/theme/colors";

export function useThemeColors() {
  const theme = useSelector((s: RootState) => s.theme.current);
  return colors[theme];
}
