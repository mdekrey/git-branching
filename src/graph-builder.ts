import { GitRepository, IInitialRef, Theme } from "./gitChart";
import { branchColors } from "./theme/theming";
import { releaseColors } from "./theme/colors";
import { downloadSvgAsPng } from "./svg-download-png";

export function makeGraph(
  name: string,
  direction: Theme["direction"],
  initialBranches: IInitialRef[]
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("data-name", name);
  document.body.appendChild(svg);
  const temp = new GitRepository(
    svg,
    {
      direction,
      rowDistance: 40,
      timeDistance: 60,
      padding: { x: 7, y: 7 },
      defaultBranchTheme: {
        strokeWidth: 3,
        includeBranchStart: true,
        includeMergeTime: true,
        textOffset: { x: 0, y: -6 },
        fontSize: 12,
        font: "Arial",
        ...branchColors(releaseColors[0])
      }
    },
    initialBranches
  );
  svg.style.cursor = "pointer";
  svg.onclick = function() {
    downloadSvgAsPng(this);
  };
  return temp;
}
