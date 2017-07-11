import {rgb} from "csx";

// hotfixes
// const hotfixColors = [
//     rgb(255,115, 59),
//     rgb(255,174,141),
//     rgb(255,142, 97),
//     rgb(255, 84, 15),
//     rgb(214, 61,  0),
// ]

// features
const featureColors = [
    rgb( 55,127,192),
    rgb(132,181,225),
    rgb( 88,151,207),
    rgb( 23,105,178),
    rgb(  9, 77,139),
]

// releases
const releaseColors = [
    rgb(111,206, 31),
    rgb(166,233,110),
    rgb(137,219, 70),
    rgb( 82,167, 12),
    rgb( 60,132,  0),
]

interface IGitGraphOptions {
    template?: "metro" | "blackarrow";
    orientation?: "vertical-reverse" | "horizontal" | "horizontal-reverse" | "vertical";
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
    author?: string
    tag?: string;
    tagColor?: string;
    labelColor?: string;
    onClick?: (commit: ICommitOptions) => void;
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
  author: "Matt DeKrey",
};

function makeGraph(elementId: string, mode: IGitGraphOptions["mode"]) {
    const canvas = document.createElement("canvas");
    canvas.id = elementId;
    document.body.appendChild(canvas);
    return new GitGraph({ ...options, elementId, mode, orientation: mode === "compact" ? "horizontal" : "vertical" });
}
function branchColors(color: string) {
    return { color, commitDefaultOptions: { dotColor: color, tagColor: color, messageColor: color, labelColor: color } }
}

function twoFeature(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    var release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    release01.commit("Initial commit");
    var featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    var featureB = release01.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(release01);
    featureB.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    return {release01, featureA, featureB};
}

function threeFeature(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    var release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    release01.commit("Initial commit");
    var featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    var featureB = release01.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(release01);
    release01.merge(featureB);
    const featureC = release01.branch({ name: "feature-c", showLabel: true, ...branchColors(featureColors[2].toString()), column: 1 })
    featureC.commit("Implement feature");
    featureB.merge(release01);
    featureC.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    return {release01, featureA, featureB, featureC};
}

function twoFeatureIncremental(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    var release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    release01.commit("Initial commit");
    var featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    var featureB = featureA.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(featureB);
    featureA.merge(release01);
    featureB.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    return {release01, featureA, featureB};
}

function twoFeatureInfrastructure(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    var release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 3 });
    release01.commit("Initial commit");
    var infrastructure = release01.branch({ name: "framework", showLabel: true, ...branchColors(featureColors[4].toString()), column: 2 });
    infrastructure.commit("Implement infrastructure");
    var featureA = infrastructure.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    var featureB = infrastructure.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(release01);
    featureB.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    return {release01, featureA, featureB};
}

function newRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    var release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 1 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    var release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });

    // release01.merge(release02);
    release02.commit({ dotColor: "transparent" })
    release01.commit({ dotColor: "transparent" })
    return {release01, release02};
}

function threeFeatureMultiRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    var release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 3 });
    release01.commit("Initial commit");
    var featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    var featureB = release01.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(featureB);
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 2 });
    const featureC = release01.branch({ name: "feature-c", showLabel: true, ...branchColors(featureColors[2].toString()), column: 1 })
    featureC.commit("Implement feature");
    featureB.merge(release02);
    featureC.merge(release02, { tag: "0.2.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release02.commit({ dotColor: "transparent" })
    release01.commit({ dotColor: "transparent" })
    return {release01, featureA, featureB, featureC};
}

threeFeature("original", "extended");
twoFeature("twoFeature", "compact");
threeFeature("threeFeature", "compact");
twoFeatureIncremental("twoFeatureIncremental", "compact");
twoFeatureInfrastructure("twoFeatureInfrastructure", "compact");
threeFeatureMultiRelease("threeFeatureMultiRelease", "compact");
newRelease("newRelease", "compact");
