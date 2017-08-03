import { ColorHelper } from "csx";
import { CommitTheme, BranchTheme } from "../gitChart";

export const deleteMarkerSize = 6;
export const deleteMarker: Partial<CommitTheme> = {
  time: 0,
  specialStyle: {
    onEnter: g => g.append("path"),
    onEach: g =>
      g
        .select<SVGPathElement>("path")
        .attr(
          "d",
          `M-${deleteMarkerSize},-${deleteMarkerSize}l${deleteMarkerSize *
            2},${deleteMarkerSize *
            2}M-${deleteMarkerSize},${deleteMarkerSize}l${deleteMarkerSize *
            2},-${deleteMarkerSize * 2}`
        )
        .attr("stroke", "red")
        .attr("stroke-width", 3)
  }
};

export function branchColors(
  color: ColorHelper
): Pick<BranchTheme, "strokeColor" | "defaultCommitTheme" | "textColor"> {
  return {
    strokeColor: color,
    textColor: color,
    defaultCommitTheme: {
      commitSize: 9,
      fillColor: color,
      strokeColor: color,
      strokeWidth: 3,
      textColor: color,
      textOffset: { x: 4, y: -4 },
      fontSize: 12,
      font: "Arial",
      time: 1
    }
  };
}
