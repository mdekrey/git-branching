import { ColorHelper, rgb } from "csx";
import {
  GitRepository,
  BranchTheme,
  IInitialRef,
  Theme,
  Commit,
  CommitTheme
} from "./gitChart";

// hotfixes
const hotfixColors = [
  rgb(255, 115, 59),
  rgb(255, 174, 141),
  rgb(255, 142, 97),
  rgb(255, 84, 15),
  rgb(214, 61, 0)
];

// features
const featureColors = [
  rgb(55, 127, 192),
  rgb(132, 181, 225),
  rgb(88, 151, 207),
  rgb(23, 105, 178),
  rgb(9, 77, 139)
];

// releases
const releaseColors = [
  rgb(111, 206, 31),
  rgb(166, 233, 110),
  rgb(137, 219, 70),
  rgb(82, 167, 12),
  rgb(60, 132, 0)
];

const deleteMarkerSize = 6;
const deleteMarker: Partial<CommitTheme> = {
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

function makeGraph(
  direction: Theme["direction"],
  initialBranches: IInitialRef[]
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  document.body.appendChild(svg);
  const temp = new GitRepository(
    svg,
    {
      direction,
      rowDistance: 40,
      timeDistance: 60,
      padding: { x: 0, y: 7 },
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
  return temp;
}

function branchColors(
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
      textOffset: { x: 3, y: -6 },
      fontSize: 12,
      font: "Arial",
      time: 1
    }
  };
}

function twoFeature(direction: Theme["direction"]) {
  const git = makeGraph(direction, [
    { name: "master", row: 2, theme: branchColors(releaseColors[0]) }
  ]);
  git
    .adjustTime(1)
    .branch("feature-a", "master", 1, branchColors(featureColors[0]))
    .commit("feature-a")
    .branch("feature-b", "master", 0, branchColors(featureColors[1]))
    .commit("feature-b")
    .commit("feature-a")
    .merge("master", "feature-a")
    .deleteRef("feature-a")
    .merge("master", "feature-b")
    .deleteRef("feature-b")
    .tag("master", "0.1.0")
    .render();
}

function threeFeature() {
  const git = makeGraph("horizontal", [
    { name: "master", row: 2, theme: branchColors(releaseColors[0]) }
  ]);
  git
    .adjustTime(1)
    .branch("feature-a", "master", 1, branchColors(featureColors[0]))
    .commit("feature-a")
    .branch("feature-b", "master", 0, branchColors(featureColors[1]))
    .commit("feature-b")
    .commit("feature-a")
    .merge("master", "feature-a")
    .deleteRef("feature-a")
    .merge("feature-b", "master")
    .branch("feature-c", "master", 1, branchColors(featureColors[2]))
    .commit("feature-c")
    .merge("master", "feature-b")
    .deleteRef("feature-b")
    .merge("master", "feature-c")
    .deleteRef("feature-c")
    .tag("master", "0.1.0")
    .render();
}

function twoFeatureIncremental() {
  const git = makeGraph("horizontal", [
    { name: "master", row: 2, theme: branchColors(releaseColors[0]) }
  ]);
  git
    .adjustTime(1)
    .branch("feature-a", "master", 1, branchColors(featureColors[0]))
    .microcommit("feature-a", {}, 2)
    .branch("feature-b", "feature-a", 0, branchColors(featureColors[1]))
    .microcommit("feature-b", {}, 2)
    .microcommit("feature-a", {}, 2)
    .merge("feature-b", "feature-a")
    .microcommit("feature-b", {}, 2)
    .merge("master", "feature-a")
    .deleteRef("feature-a")
    .microcommit("feature-b", {}, 2)
    .merge("master", "feature-b")
    .deleteRef("feature-b")
    .tag("master", "0.1.0")
    .render();
}

function twoFeatureInfrastructure() {
  makeGraph("horizontal", [
    { name: "master", row: 3, theme: branchColors(releaseColors[0]) }
  ])
    .adjustTime(1)
    .branch("infrastructure", "master", 2, branchColors(featureColors[4]))
    .commit("infrastructure")
    .branch("feature-a", "infrastructure", 1, branchColors(featureColors[0]))
    .commit("feature-a")
    .branch("feature-b", "infrastructure", 0, branchColors(featureColors[1]))
    .commit("feature-b")
    .commit("feature-a")
    .merge("master", "feature-a")
    .deleteRef("feature-a")
    .commit("infrastructure", deleteMarker)
    .deleteRef("infrastructure")
    .merge("master", "feature-b")
    .deleteRef("feature-b")
    .tag("master", "0.1.0")
    .render();
}

function threeFeatureMultiRelease() {
  makeGraph("horizontal", [
    { name: "0.1", row: 3, theme: branchColors(releaseColors[0]) }
  ])
    .adjustTime(1)
    .branch("feature-a", "0.1", 1, branchColors(featureColors[0]))
    .commit("feature-a")
    .branch("feature-b", "0.1", 0, branchColors(featureColors[1]))
    .commit("feature-b")
    .commit("feature-a")
    .merge("0.1", "feature-a")
    .tag("0.1", "0.1.0")
    .deleteRef("feature-a")
    .merge("feature-b", "0.1")
    .branch("0.2", "0.1", 2, branchColors(releaseColors[1]))
    .branch("feature-c", "0.2", 1, branchColors(featureColors[2]))
    .commit("feature-c")
    .merge("0.2", "feature-b")
    .deleteRef("feature-b")
    .merge("0.2", "feature-c")
    .tag("0.2", "0.2.0")
    .deleteRef("feature-c")
    .render();
}

function newRelease() {
  makeGraph("horizontal", [
    { name: "0.1", row: 1, theme: branchColors(releaseColors[0]) }
  ])
    .commit("0.1")
    .tag("0.1", "0.1.0")
    .branch("0.2", "0.1", 0, branchColors(releaseColors[1]))
    .render();
}

function hotfixRelease() {
  makeGraph("horizontal", [
    { name: "0.1", row: 1, theme: branchColors(releaseColors[0]) }
  ])
    .commit("0.1")
    .tag("0.1", "0.1.0")
    .branch("0.2", "0.1", 0, branchColors(releaseColors[1]))
    .branch("hotfix-1", "0.1", 2, branchColors(hotfixColors[0]))
    .microcommit("hotfix-1", {}, 2)
    .merge("0.1", "hotfix-1")
    .deleteRef("hotfix-1")
    .tag("0.1", "0.1.1")
    .merge("0.2", "0.1")
    .render();
}

function fullFeature() {
  makeGraph("horizontal", [
    { name: "0.1", row: 3, theme: branchColors(releaseColors[0]) }
  ])
    .adjustTime(1)
    .branch("feature-a", "0.1", 1, branchColors(featureColors[0]))
    .microcommit("feature-a")
    .branch("feature-b", "0.1", 0, branchColors(featureColors[1]))
    .microcommit("feature-b")
    .microcommit("feature-a")
    .merge("0.1", "feature-a")
    .tag("0.1", "0.1.0")
    .deleteRef("feature-a")
    .merge("feature-b", "0.1")
    .branch("0.2", "0.1", 2, branchColors(releaseColors[1]))
    .branch("feature-c", "0.2", 1, branchColors(featureColors[2]))
    .microcommit("feature-c")
    .merge("0.2", "feature-b")
    .deleteRef("feature-b")
    .branch("hotfix-1", "0.1", 4, branchColors(hotfixColors[0]))
    .microcommit("hotfix-1")
    .merge("0.1", "hotfix-1")
    .tag("0.1", "0.1.1")
    .deleteRef("hotfix-1")
    .merge("0.2", "0.1")
    .merge("feature-c", "0.1")
    .merge("0.2", "feature-c")
    .tag("0.2", "0.2.0")
    .deleteRef("feature-c")
    .render();
}

function prettier() {
  const gitgraph = makeGraph("horizontal", [
    { name: "infrastructure", row: 0, theme: branchColors(releaseColors[0]) },
    { name: "feature-a", row: 1, theme: branchColors(featureColors[0]) }
  ]);
  let preprettier: Commit;
  let prettyify: Commit;
  gitgraph
    .adjustTime(0.5)
    .microcommit("infrastructure")
    .microcommit("infrastructure")
    .microcommit("feature-a", { label: "Feature work" })
    .commit(
      "infrastructure",
      { label: "Add prettier" },
      undefined,
      c => (preprettier = c)
    )
    .adjustTime(0.2)
    .commit(
      "infrastructure",
      { label: "Prettyify" },
      undefined,
      c => (prettyify = c)
    )
    .microcommit("infrastructure", { label: "Other work" })
    .microcommit("infrastructure")
    .merge("feature-a", preprettier!)
    .merge("feature-a", prettyify!)
    .commit("feature-a", { label: "Prettyify" })
    .merge("feature-a", "infrastructure")
    .render();
}

twoFeature("horizontal");
twoFeature("vertical");
threeFeature();
twoFeatureIncremental();
twoFeatureInfrastructure();
threeFeatureMultiRelease();
newRelease();
hotfixRelease();
fullFeature();
prettier();
