import {rgb} from "csx";

// hotfixes
const hotfixColors = [
    rgb(255,115, 59),
    rgb(255,174,141),
    rgb(255,142, 97),
    rgb(255, 84, 15),
    rgb(214, 61,  0),
]

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

const hiddenCommit: ICommitOptions = {
    dotColor: "transparent",
    messageAuthorDisplay: false,
    messageBranchDisplay: false,
    messageHashDisplay: false,
    messageDisplay: false,
} as any

function makeGraph(elementId: string, mode: IGitGraphOptions["mode"]) {
    const canvas = document.createElement("canvas");
    canvas.id = elementId;
    document.body.appendChild(canvas);
    return new GitGraph({ ...options, elementId, mode: "compact", orientation: mode === "compact" ? "horizontal" : "vertical" });
}
function branchColors(color: string) {
    return { color, commitDefaultOptions: { dotColor: color, tagColor: color, messageColor: color, labelColor: color } }
}

function twoFeature(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    release01.commit("Initial commit");
    const featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    const featureB = release01.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(release01);
    featureB.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    return {release01, featureA, featureB};
}

function threeFeature(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    release01.commit("Initial commit");
    const featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    const featureB = release01.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
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
    const release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    release01.commit("Initial commit");
    const featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    const featureB = featureA.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
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
    const release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 3 });
    release01.commit("Initial commit");
    const infrastructure = release01.branch({ name: "framework", showLabel: true, ...branchColors(featureColors[4].toString()), column: 2 });
    infrastructure.commit("Implement infrastructure");
    const featureA = infrastructure.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    const featureB = infrastructure.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(release01);
    featureB.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    return {release01, featureA, featureB};
}

function newRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 1 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });

    // release01.merge(release02);
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, release02};
}

function threeFeatureMultiRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 3 });
    release01.commit("Initial commit");
    const featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    const featureB = release01.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(featureB);
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 2 });
    const featureC = release01.branch({ name: "feature-c", showLabel: true, ...branchColors(featureColors[2].toString()), column: 1 })
    featureC.commit("Implement feature");
    featureB.merge(release02);
    featureC.merge(release02, { tag: "0.2.0", dotColor: "white", dotStrokeColor: release02.color, dotStrokeWidth: 10, dotSize: 9 });
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, featureA, featureB, featureC};
}

function threeFeatureMultiReleaseMaster(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const master = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    master.commit("Initial commit");
    const featureA = master.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    const featureB = master.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    featureA.commit("Finish feature");
    featureA.merge(master, { tag: "0.1.0", dotColor: "white", dotStrokeColor: master.color, dotStrokeWidth: 10, dotSize: 9 });
    master.merge(featureB);
    const release01 = master.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 3 });
    release01.commit(hiddenCommit)
    const featureC = master.branch({ name: "feature-c", showLabel: true, ...branchColors(featureColors[2].toString()), column: 1 })
    featureC.commit("Implement feature");
    featureB.merge(master);
    featureC.merge(master, { tag: "0.2.0", dotColor: "white", dotStrokeColor: master.color, dotStrokeWidth: 10, dotSize: 9 });
    master.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {master, release01, featureA, featureB, featureC};
}

function hotfixRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 1 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    release02.commit(hiddenCommit)
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix01 = release01.branch({ name: "hotfix-1", showLabel: true, ...branchColors(hotfixColors[0].toString()), column: 2 })
    hotfix01.commit();
    hotfix01.merge(release01, { tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(release02);

    // release01.merge(release02);
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, release02, hotfix01};
}

function twoHotfixBadRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 1 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    release02.commit(hiddenCommit)
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix01 = release01.branch({ name: "hotfix-1", showLabel: true, ...branchColors(hotfixColors[0].toString()), column: 2 })
    hotfix01.commit();
    hotfix01.merge(release01, { tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    hotfix01.merge(release02);
    const hotfix02 = release01.branch({ name: "hotfix-2", showLabel: true, ...branchColors(hotfixColors[1].toString()), column: 2 })
    hotfix02.commit();
    hotfix02.merge(release01, { tag: "0.1.2", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    hotfix02.merge(release02);


    // release01.merge(release02);
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, release02, hotfix01, hotfix02};
}

function twoHotfixGoodRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 1 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    release02.commit(hiddenCommit)
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix01 = release01.branch({ name: "hotfix-1", showLabel: true, ...branchColors(hotfixColors[0].toString()), column: 2 })
    hotfix01.commit();
    hotfix01.merge(release01, { tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(release02);
    const hotfix02 = release01.branch({ name: "hotfix-2", showLabel: true, ...branchColors(hotfixColors[1].toString()), column: 2 })
    hotfix02.commit();
    hotfix02.merge(release01, { tag: "0.1.2", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(release02, { tag: "0.2.1", dotColor: "white", dotStrokeColor: release02.color, dotStrokeWidth: 10, dotSize: 9 });


    // release01.merge(release02);
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, release02, hotfix01, hotfix02};
}

function twoFeatureNoRebase(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 3 });
    release01.commit("Initial commit");
    const infrastructure = release01.branch({ name: "framework", showLabel: true, ...branchColors(featureColors[4].toString()), column: 2 });
    infrastructure.commit("Implement infrastructure");
    const featureA = infrastructure.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    const featureB = infrastructure.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    release01.commit();
    featureA.commit("Finish feature");
    release01.merge(featureA);
    featureA.merge(release01);
    featureB.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    return {release01, featureA, featureB};
}

function twoFeatureBadRebase(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "master", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 3 });
    release01.commit("Initial commit");
    const infrastructure = release01.branch({ name: "framework", showLabel: true, ...branchColors(featureColors[4].toString()), column: 2 });
    infrastructure.commit("Implement infrastructure");
    const featureB = infrastructure.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature");
    release01.commit();
    const infrastructure2 = release01.branch({ name: "framework", showLabel: true, ...branchColors(featureColors[4].toString()), column: 2 });
    infrastructure2.commit("Implement infrastructure");

    const featureA = infrastructure2.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature WIP");
    featureA.commit("Finish feature");
    featureA.merge(release01);
    featureB.merge(release01);
    return {release01, featureA, featureB};
}

function threeHotfixCherryPick(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 2 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    release02.commit(hiddenCommit)
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix01 = release01.branch({ name: "hotfix-1", showLabel: true, ...branchColors(hotfixColors[0].toString()), column: 3 })
    hotfix01.commit();
    hotfix01.merge(release01, { tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix02 = release01.branch({ name: "hotfix-2", showLabel: true, ...branchColors(hotfixColors[1].toString()), column: 3 })
    hotfix02.commit();
    hotfix02.merge(release01, { tag: "0.1.2", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix02cherry = release02.branch({ name: "hotfix-2-cherry", showLabel: true, ...branchColors(hotfixColors[1].toString()), column: 1 })
    hotfix02cherry.commit();
    hotfix02cherry.merge(release02, { tag: "0.2.1", dotColor: "white", dotStrokeColor: release02.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix03 = release01.branch({ name: "hotfix-3", showLabel: true, ...branchColors(hotfixColors[2].toString()), column: 3 })
    hotfix03.commit();
    hotfix03.merge(release01, { tag: "0.1.3", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix03cherry = release02.branch({ name: "hotfix-3-cherry", showLabel: true, ...branchColors(hotfixColors[2].toString()), column: 1 })
    hotfix03cherry.commit();
    hotfix03cherry.merge(release02, { tag: "0.2.2", dotColor: "white", dotStrokeColor: release02.color, dotStrokeWidth: 10, dotSize: 9 });
    release02.commit(hiddenCommit)

    // release01.merge(release02);
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, release02, hotfix01, hotfix02};
}

function threeHotfixCherryPickDirect(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 1 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    release02.commit(hiddenCommit)
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix01 = release01.branch({ name: "hotfix-1", showLabel: true, ...branchColors(hotfixColors[0].toString()), column: 2 })
    hotfix01.commit();
    hotfix01.merge(release01, { tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix02 = release01.branch({ name: "hotfix-2", showLabel: true, ...branchColors(hotfixColors[1].toString()), column: 2 })
    hotfix02.commit();
    hotfix02.merge(release01, { tag: "0.1.2", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release02.commit(hiddenCommit)
    release02.commit({ tag: "0.2.1", dotColor: "white", dotStrokeColor: hotfixColors[1].toString(), dotStrokeWidth: 10, dotSize: 9 });
    const hotfix03 = release01.branch({ name: "hotfix-3", showLabel: true, ...branchColors(hotfixColors[2].toString()), column: 2 })
    hotfix03.commit();
    hotfix03.merge(release01, { tag: "0.1.3", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release02.commit(hiddenCommit)
    release02.commit({ tag: "0.2.2", dotColor: "white", dotStrokeColor: hotfixColors[2].toString(), dotStrokeWidth: 10, dotSize: 9 });

    // release01.merge(release02);
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, release02, hotfix01, hotfix02};
}

function threeHotfixGoodRelease(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 1 });
    release01.commit({ tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 0 });
    release02.commit(hiddenCommit)
    // release01.commit({ tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix01 = release01.branch({ name: "hotfix-1", showLabel: true, ...branchColors(hotfixColors[0].toString()), column: 2 })
    hotfix01.commit();
    hotfix01.merge(release01, { tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(release02);
    const hotfix02 = release01.branch({ name: "hotfix-2", showLabel: true, ...branchColors(hotfixColors[1].toString()), column: 2 })
    hotfix02.commit();
    hotfix02.merge(release01, { tag: "0.1.2", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(release02, { tag: "0.2.1", dotColor: "white", dotStrokeColor: release02.color, dotStrokeWidth: 10, dotSize: 9 });
    const hotfix03 = release01.branch({ name: "hotfix-3", showLabel: true, ...branchColors(hotfixColors[2].toString()), column: 2 })
    hotfix03.commit();
    hotfix03.merge(release01, { tag: "0.1.3", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(release02, { tag: "0.2.2", dotColor: "white", dotStrokeColor: release02.color, dotStrokeWidth: 10, dotSize: 9 });
    release02.commit(hiddenCommit)

    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, release02, hotfix01, hotfix02};
}

function fullFeature(target: string, mode: IGitGraphOptions["mode"]) {
    const gitgraph = makeGraph(target, mode);
    console.log(gitgraph);
    const release01 = gitgraph.branch({ name: "0.1", showLabel: true, ...branchColors(releaseColors[0].toString()), column: 3 });
    release01.commit("Initial commit");
    const featureA = release01.branch({ name: "feature-a", showLabel: true, ...branchColors(featureColors[0].toString()), column: 1 });
    featureA.commit("Implement feature A WIP");
    const featureB = release01.branch({ name: "feature-b", showLabel: true, ...branchColors(featureColors[1].toString()), column: 0 });
    featureB.commit("Implement feature B");
    featureA.commit("Finish feature A");
    featureA.merge(release01, { tag: "0.1.0", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(featureB);
    const release02 = release01.branch({ name: "0.2", showLabel: true, ...branchColors(releaseColors[1].toString()), column: 2 });
    const featureC = release01.branch({ name: "feature-c", showLabel: true, ...branchColors(featureColors[2].toString()), column: 1 })
    featureC.commit("Implement feature C");
    featureB.merge(release02);
    const hotfix01 = release01.branch({ name: "hotfix-1", showLabel: true, ...branchColors(hotfixColors[0].toString()), column: 4 })
    hotfix01.commit("P1 bug fix!");
    hotfix01.merge(release01, { tag: "0.1.1", dotColor: "white", dotStrokeColor: release01.color, dotStrokeWidth: 10, dotSize: 9 });
    release01.merge(release02);
    featureC.merge(release02, { tag: "0.2.0", dotColor: "white", dotStrokeColor: release02.color, dotStrokeWidth: 10, dotSize: 9 });
    release02.commit(hiddenCommit)
    release01.commit(hiddenCommit)
    return {release01, featureA, featureB, featureC};
}

twoFeature("twoFeature", "compact");
threeFeature("threeFeature", "compact");
twoFeatureIncremental("twoFeatureIncremental", "compact");
twoFeatureInfrastructure("twoFeatureInfrastructure", "compact");
threeFeatureMultiRelease("threeFeatureMultiRelease", "compact");
threeFeatureMultiReleaseMaster("threeFeatureMultiReleaseMaster", "compact");
newRelease("newRelease", "compact");
hotfixRelease("hotfixRelease", "compact");
twoHotfixBadRelease("twoHotfixBadRelease", "compact");
twoHotfixGoodRelease("twoHotfixGoodRelease", "compact");
twoFeatureNoRebase("twoFeatureNoRebase", "compact");
twoFeatureBadRebase("twoFeatureBadRebase", "compact");
threeHotfixCherryPick("threeHotfixCherryPick", "compact");
threeHotfixCherryPickDirect("threeHotfixCherryPickDirect", "compact");
threeHotfixGoodRelease("threeHotfixGoodRelease", "compact");
fullFeature("fullFeature", "compact");
