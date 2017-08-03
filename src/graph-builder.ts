import { GitRepository, IInitialRef, Theme } from "./gitChart";
import { branchColors } from "./theme/theming";
import { serviceLineColors } from "./theme/colors";
import { downloadSvgAsPng } from "./svg-download-png";

export function makeGraph(
  name: string,
  overrideTheme: Partial<Theme>,
  initialBranches: IInitialRef[]
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("data-name", name);
  document.body.appendChild(svg);
  const temp = new GitRepository(
    svg,
    {
      direction: "horizontal",
      rowDistance: 40,
      timeDistance: 60,
      padding: { x: 7, y: 7 },
      defaultBranchTheme: {
        strokeWidth: 3,
        includeBranchStart: true,
        includeBranchEnd: true,
        includeMergeTime: true,
        textOffset: { x: 0, y: -3 },
        fontSize: 12,
        font: "Arial",
        ...branchColors(serviceLineColors[0])
      },
      ...overrideTheme
    },
    initialBranches
  );
  svg.style.cursor = "pointer";
  svg.onclick = function() {
    downloadSvgAsPng(this);
  };
  return temp;
}
