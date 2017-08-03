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

interface IGitGraphOptions {
  template?: "metro" | "blackarrow";
  orientation?:
    | "vertical-reverse"
    | "horizontal"
    | "horizontal-reverse"
    | "vertical";
  mode?: "compact" | "extended";
  elementId: string;
  author?: string;
}

interface ICommitOptions {
  dotColor?: string;
  dotSize?: number;
  dotStrokeColor?: string;
  dotStrokeWidth?: number;
  sha1?: string;
  message?: string;
  author?: string;
  tag?: string;
  tagColor?: string;
  labelColor?: string;
  onClick?: (commit: ICommitOptions) => void;
  messageAuthorDisplay?: boolean;
  messageBranchDisplay?: boolean;
  messageHashDisplay?: boolean;
  messageDisplay?: boolean;
}

interface IBranchOptions {
  color?: string;
  parentBranch?: IGitGraphish;
  name: string;
  column?: number;
  showLabel?: boolean;
  commitDefaultOptions?: Partial<ICommitOptions>;
}

interface IGitGraphish {
  color: string;
  branch(branchName: string | IBranchOptions): IGitGraphish;
  commit(options?: string | ICommitOptions): this;
  merge<T extends IGitGraphish>(target: T, options?: ICommitOptions): T;
}

declare class GitGraph implements IGitGraphish {
  constructor(options?: IGitGraphOptions);

  color: string;
  branch(branchName: string | IBranchOptions): IGitGraphish;
  commit(options?: string | ICommitOptions): this;
  merge<T extends IGitGraphish>(target: T, options?: ICommitOptions): T;
}

const options: Pick<IGitGraphOptions, "template" | "orientation" | "author"> = {
  template: "metro",
  author: "Matt DeKrey"
};

const hiddenCommit: ICommitOptions = {
  dotColor: "transparent",
  messageAuthorDisplay: false,
  messageBranchDisplay: false,
  messageHashDisplay: false,
  messageDisplay: false
};

const conflict: ICommitOptions = {
  dotStrokeColor: "#ff0000",
  dotStrokeWidth: 10,
  dotSize: 9
};

const tag: ICommitOptions = {
  dotColor: "white",
  dotStrokeWidth: 10,
  dotSize: 9
};

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
function makeOldGraph(elementId: string, mode: IGitGraphOptions["mode"]) {
  const canvas = document.createElement("canvas");
  canvas.id = elementId;
  document.body.appendChild(canvas);
  return new GitGraph({
    ...options,
    elementId,
    mode: "compact",
    orientation: mode === "compact" ? "horizontal" : "vertical"
  });
}
function oldBranchColors(color: string) {
  return {
    color,
    commitDefaultOptions: {
      dotColor: color,
      tagColor: color,
      messageColor: color,
      labelColor: color
    }
  };
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

function newRelease() {
  makeGraph("horizontal", [
    { name: "0.1", row: 1, theme: branchColors(releaseColors[0]) }
  ])
    .commit("0.1")
    .tag("0.1", "0.1.0")
    .branch("0.2", "0.1", 0, branchColors(releaseColors[1]))
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

function hotfixRelease(target: string, mode: IGitGraphOptions["mode"]) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "0.1",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 1
  });
  release01.commit({ tag: "0.1.0", dotStrokeColor: release01.color, ...tag });
  const release02 = release01.branch({
    name: "0.2",
    showLabel: true,
    ...oldBranchColors(releaseColors[1].toString()),
    column: 0
  });
  release02.commit(hiddenCommit);
  const hotfix01 = release01.branch({
    name: "hotfix-1",
    showLabel: true,
    ...oldBranchColors(hotfixColors[0].toString()),
    column: 2
  });
  hotfix01.commit();
  hotfix01.merge(release01, {
    tag: "0.1.1",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(release02);

  release02.commit(hiddenCommit);
  release01.commit(hiddenCommit);
  return { release01, release02, hotfix01 };
}

function twoHotfixBadRelease(target: string, mode: IGitGraphOptions["mode"]) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "0.1",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 1
  });
  release01.commit({ tag: "0.1.0", dotStrokeColor: release01.color, ...tag });
  const release02 = release01.branch({
    name: "0.2",
    showLabel: true,
    ...oldBranchColors(releaseColors[1].toString()),
    column: 0
  });
  release02.commit(hiddenCommit);
  const hotfix01 = release01.branch({
    name: "hotfix-1",
    showLabel: true,
    ...oldBranchColors(hotfixColors[0].toString()),
    column: 2
  });
  hotfix01.commit();
  hotfix01.merge(release01, {
    tag: "0.1.1",
    dotStrokeColor: release01.color,
    ...tag
  });
  hotfix01.merge(release02);
  const hotfix02 = release01.branch({
    name: "hotfix-2",
    showLabel: true,
    ...oldBranchColors(hotfixColors[1].toString()),
    column: 2
  });
  hotfix02.commit();
  hotfix02.merge(release01, {
    tag: "0.1.2",
    dotStrokeColor: release01.color,
    ...tag
  });
  hotfix02.merge(release02, conflict);

  release02.commit(hiddenCommit);
  release01.commit(hiddenCommit);
  return { release01, release02, hotfix01, hotfix02 };
}

function twoHotfixGoodRelease(target: string, mode: IGitGraphOptions["mode"]) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "0.1",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 1
  });
  release01.commit({ tag: "0.1.0", dotStrokeColor: release01.color, ...tag });
  const release02 = release01.branch({
    name: "0.2",
    showLabel: true,
    ...oldBranchColors(releaseColors[1].toString()),
    column: 0
  });
  release02.commit(hiddenCommit);
  const hotfix01 = release01.branch({
    name: "hotfix-1",
    showLabel: true,
    ...oldBranchColors(hotfixColors[0].toString()),
    column: 2
  });
  hotfix01.commit();
  hotfix01.merge(release01, {
    tag: "0.1.1",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(release02);
  const hotfix02 = release01.branch({
    name: "hotfix-2",
    showLabel: true,
    ...oldBranchColors(hotfixColors[1].toString()),
    column: 2
  });
  hotfix02.commit();
  hotfix02.merge(release01, {
    tag: "0.1.2",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(release02, {
    tag: "0.2.1",
    dotStrokeColor: release02.color,
    ...tag
  });

  release02.commit(hiddenCommit);
  release01.commit(hiddenCommit);
  return { release01, release02, hotfix01, hotfix02 };
}

function twoFeatureNoRebase(target: string, mode: IGitGraphOptions["mode"]) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "master",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 3
  });
  release01.commit("Initial commit");
  const infrastructure = release01.branch({
    name: "framework",
    showLabel: true,
    ...oldBranchColors(featureColors[4].toString()),
    column: 2
  });
  infrastructure.commit("Implement infrastructure");
  const featureA = infrastructure.branch({
    name: "feature-a",
    showLabel: true,
    ...oldBranchColors(featureColors[0].toString()),
    column: 1
  });
  featureA.commit("Implement feature WIP");
  const featureB = infrastructure.branch({
    name: "feature-b",
    showLabel: true,
    ...oldBranchColors(featureColors[1].toString()),
    column: 0
  });
  featureB.commit("Implement feature");
  release01.commit();
  featureA.commit("Finish feature");
  release01.merge(featureA);
  featureA.merge(release01);
  featureB.merge(release01, {
    tag: "0.1.0",
    dotStrokeColor: release01.color,
    ...tag
  });
  return { release01, featureA, featureB };
}

function twoFeatureBadRebase(target: string, mode: IGitGraphOptions["mode"]) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "master",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 3
  });
  release01.commit("Initial commit");
  const infrastructure = release01.branch({
    name: "framework",
    showLabel: true,
    ...oldBranchColors(featureColors[4].toString()),
    column: 2
  });
  infrastructure.commit("Implement infrastructure");
  const featureB = infrastructure.branch({
    name: "feature-b",
    showLabel: true,
    ...oldBranchColors(featureColors[1].toString()),
    column: 0
  });
  featureB.commit("Implement feature");
  release01.commit();
  const infrastructure2 = release01.branch({
    name: "framework",
    showLabel: true,
    ...oldBranchColors(featureColors[4].toString()),
    column: 2
  });
  infrastructure2.commit("Implement infrastructure");

  const featureA = infrastructure2.branch({
    name: "feature-a",
    showLabel: true,
    ...oldBranchColors(featureColors[0].toString()),
    column: 1
  });
  featureA.commit("Implement feature WIP");
  featureA.commit("Finish feature");
  featureA.merge(release01);
  featureB.merge(release01, conflict);
  return { release01, featureA, featureB };
}

function threeHotfixCherryPick(target: string, mode: IGitGraphOptions["mode"]) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "0.1",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 2
  });
  release01.commit({ tag: "0.1.0", dotStrokeColor: release01.color, ...tag });
  const release02 = release01.branch({
    name: "0.2",
    showLabel: true,
    ...oldBranchColors(releaseColors[1].toString()),
    column: 0
  });
  release02.commit(hiddenCommit);
  const hotfix01 = release01.branch({
    name: "hotfix-1",
    showLabel: true,
    ...oldBranchColors(hotfixColors[0].toString()),
    column: 3
  });
  hotfix01.commit();
  hotfix01.merge(release01, {
    tag: "0.1.1",
    dotStrokeColor: release01.color,
    ...tag
  });
  const hotfix02 = release01.branch({
    name: "hotfix-2",
    showLabel: true,
    ...oldBranchColors(hotfixColors[1].toString()),
    column: 3
  });
  hotfix02.commit();
  hotfix02.merge(release01, {
    tag: "0.1.2",
    dotStrokeColor: release01.color,
    ...tag
  });
  const hotfix02cherry = release02.branch({
    name: "hotfix-2-cherry",
    showLabel: true,
    ...oldBranchColors(hotfixColors[1].toString()),
    column: 1
  });
  hotfix02cherry.commit();
  hotfix02cherry.merge(release02, {
    tag: "0.2.1",
    dotStrokeColor: release02.color,
    ...tag
  });
  const hotfix03 = release01.branch({
    name: "hotfix-3",
    showLabel: true,
    ...oldBranchColors(hotfixColors[2].toString()),
    column: 3
  });
  hotfix03.commit();
  hotfix03.merge(release01, {
    tag: "0.1.3",
    dotStrokeColor: release01.color,
    ...tag
  });
  const hotfix03cherry = release02.branch({
    name: "hotfix-3-cherry",
    showLabel: true,
    ...oldBranchColors(hotfixColors[2].toString()),
    column: 1
  });
  hotfix03cherry.commit();
  hotfix03cherry.merge(release02, {
    tag: "0.2.2",
    dotStrokeColor: release02.color,
    ...tag
  });
  release02.commit(hiddenCommit);

  release02.commit(hiddenCommit);
  release01.commit(hiddenCommit);
  return { release01, release02, hotfix01, hotfix02 };
}

function threeHotfixCherryPickDirect(
  target: string,
  mode: IGitGraphOptions["mode"]
) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "0.1",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 1
  });
  release01.commit({ tag: "0.1.0", dotStrokeColor: release01.color, ...tag });
  const release02 = release01.branch({
    name: "0.2",
    showLabel: true,
    ...oldBranchColors(releaseColors[1].toString()),
    column: 0
  });
  release02.commit(hiddenCommit);
  const hotfix01 = release01.branch({
    name: "hotfix-1",
    showLabel: true,
    ...oldBranchColors(hotfixColors[0].toString()),
    column: 2
  });
  hotfix01.commit();
  hotfix01.merge(release01, {
    tag: "0.1.1",
    dotStrokeColor: release01.color,
    ...tag
  });
  const hotfix02 = release01.branch({
    name: "hotfix-2",
    showLabel: true,
    ...oldBranchColors(hotfixColors[1].toString()),
    column: 2
  });
  hotfix02.commit();
  hotfix02.merge(release01, {
    tag: "0.1.2",
    dotStrokeColor: release01.color,
    ...tag
  });
  release02.commit(hiddenCommit);
  release02.commit({
    tag: "0.2.1",
    dotStrokeColor: hotfixColors[1].toString(),
    ...tag
  });
  const hotfix03 = release01.branch({
    name: "hotfix-3",
    showLabel: true,
    ...oldBranchColors(hotfixColors[2].toString()),
    column: 2
  });
  hotfix03.commit();
  hotfix03.merge(release01, {
    tag: "0.1.3",
    dotStrokeColor: release01.color,
    ...tag
  });
  release02.commit(hiddenCommit);
  release02.commit({
    tag: "0.2.2",
    dotStrokeColor: hotfixColors[2].toString(),
    ...tag
  });

  release02.commit(hiddenCommit);
  release01.commit(hiddenCommit);
  return { release01, release02, hotfix01, hotfix02 };
}

function threeHotfixGoodRelease(
  target: string,
  mode: IGitGraphOptions["mode"]
) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "0.1",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 1
  });
  release01.commit({ tag: "0.1.0", dotStrokeColor: release01.color, ...tag });
  const release02 = release01.branch({
    name: "0.2",
    showLabel: true,
    ...oldBranchColors(releaseColors[1].toString()),
    column: 0
  });
  release02.commit(hiddenCommit);
  const hotfix01 = release01.branch({
    name: "hotfix-1",
    showLabel: true,
    ...oldBranchColors(hotfixColors[0].toString()),
    column: 2
  });
  hotfix01.commit();
  hotfix01.merge(release01, {
    tag: "0.1.1",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(release02);
  const hotfix02 = release01.branch({
    name: "hotfix-2",
    showLabel: true,
    ...oldBranchColors(hotfixColors[1].toString()),
    column: 2
  });
  hotfix02.commit();
  hotfix02.merge(release01, {
    tag: "0.1.2",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(release02, {
    tag: "0.2.1",
    dotStrokeColor: release02.color,
    ...tag
  });
  const hotfix03 = release01.branch({
    name: "hotfix-3",
    showLabel: true,
    ...oldBranchColors(hotfixColors[2].toString()),
    column: 2
  });
  hotfix03.commit();
  hotfix03.merge(release01, {
    tag: "0.1.3",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(release02, {
    tag: "0.2.2",
    dotStrokeColor: release02.color,
    ...tag
  });
  release02.commit(hiddenCommit);

  release02.commit(hiddenCommit);
  release01.commit(hiddenCommit);
  return { release01, release02, hotfix01, hotfix02 };
}

function fullFeature(target: string, mode: IGitGraphOptions["mode"]) {
  const gitgraph = makeOldGraph(target, mode);
  const release01 = gitgraph.branch({
    name: "0.1",
    showLabel: true,
    ...oldBranchColors(releaseColors[0].toString()),
    column: 3
  });
  release01.commit("Initial commit");
  const featureA = release01.branch({
    name: "feature-a",
    showLabel: true,
    ...oldBranchColors(featureColors[0].toString()),
    column: 1
  });
  featureA.commit("Implement feature A WIP");
  const featureB = release01.branch({
    name: "feature-b",
    showLabel: true,
    ...oldBranchColors(featureColors[1].toString()),
    column: 0
  });
  featureB.commit("Implement feature B");
  featureA.commit("Finish feature A");
  featureA.merge(release01, {
    tag: "0.1.0",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(featureB);
  const release02 = release01.branch({
    name: "0.2",
    showLabel: true,
    ...oldBranchColors(releaseColors[1].toString()),
    column: 2
  });
  const featureC = release01.branch({
    name: "feature-c",
    showLabel: true,
    ...oldBranchColors(featureColors[2].toString()),
    column: 1
  });
  featureC.commit("Implement feature C");
  featureB.merge(release02);
  const hotfix01 = release01.branch({
    name: "hotfix-1",
    showLabel: true,
    ...oldBranchColors(hotfixColors[0].toString()),
    column: 4
  });
  hotfix01.commit("P1 bug fix!");
  hotfix01.merge(release01, {
    tag: "0.1.1",
    dotStrokeColor: release01.color,
    ...tag
  });
  release01.merge(release02);
  featureC.merge(release02, {
    tag: "0.2.0",
    dotStrokeColor: release02.color,
    ...tag
  });
  release02.commit(hiddenCommit);
  release01.commit(hiddenCommit);
  return { release01, featureA, featureB, featureC };
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
hotfixRelease("hotfixRelease", "compact");
twoHotfixBadRelease("twoHotfixBadRelease", "compact");
twoHotfixGoodRelease("twoHotfixGoodRelease", "compact");
twoFeatureNoRebase("twoFeatureNoRebase", "compact");
twoFeatureBadRebase("twoFeatureBadRebase", "compact");
threeHotfixCherryPick("threeHotfixCherryPick", "compact");
threeHotfixCherryPickDirect("threeHotfixCherryPickDirect", "compact");
threeHotfixGoodRelease("threeHotfixGoodRelease", "compact");
fullFeature("fullFeature", "compact");
prettier();
