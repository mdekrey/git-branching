import { GitRepository, BranchTheme } from "../gitChart";
import {
  branchColors,
  conflictMarker,
  deleteMarker,
  fastforwardMarker
} from "../theme/theming";
import {
  releaseCandidateColors,
  serviceLineColors,
  featureColors,
  hotfixColors,
  integrationBranchColors
} from "../theme/colors";
import { makeGraph } from "../graph-builder";

export type ExistingBranches<T extends string> = Record<T, string>;
export type NewBranches<T extends string> = Record<
  T,
  { name: string; row: number; theme: Partial<BranchTheme> }
>;

export function gettingStartedFull() {
  const featureOffset = 0;
  const releaseOffset = 5;
  const hotfixOffset = 4;
  const integrationOffset = 3;
  makeGraph(
    "fullBetterGit",
    {
      direction: "vertical",
      timeDistance: 40
    },
    [
      {
        name: "infrastructure",
        row: featureOffset + 2,
        theme: branchColors(featureColors[3])
      }
    ]
  )
    .adjustTime(2)
    .branch(
      "feature-a",
      "infrastructure",
      featureOffset + 1,
      branchColors(featureColors[0])
    )
    .microcommit("feature-a")
    .branch(
      "feature-b",
      "infrastructure",
      featureOffset + 0,
      branchColors(featureColors[1])
    )
    .microcommit(["feature-a", "feature-b"])
    .branch(
      "rc0.1",
      "infrastructure",
      4,
      branchColors(releaseCandidateColors[0])
    )
    .merge("rc0.1", "feature-a")
    .branch("0.1", "rc0.1", releaseOffset + 0, {
      ...branchColors(serviceLineColors[0]),
      includeBranchStart: false
    })
    .tag("0.1", "0.1.0")
    .commit("infrastructure", deleteMarker)
    .deleteRef("infrastructure")
    .commit("rc0.1", deleteMarker)
    .deleteRef("rc0.1")
    .commit("feature-a", deleteMarker)
    .deleteRef("feature-a")
    .merge("feature-b", "0.1")
    .branch(
      "feature-c",
      "0.1",
      featureOffset + 2,
      branchColors(featureColors[2])
    )
    .microcommit(["feature-b", "feature-c"])
    .branch("rc0.2", "0.1", 6, branchColors(releaseCandidateColors[1]))
    .merge("rc0.2", "feature-b")
    .commit("feature-c", conflictMarker)
    .branch(
      "integrate-b-c",
      "0.1",
      integrationOffset,
      branchColors(integrationBranchColors[0])
    )
    .merge("integrate-b-c", "feature-b")
    .merge("integrate-b-c", "feature-c")
    .merge("rc0.2", "integrate-b-c")
    .branch("hotfix-1", "0.1", hotfixOffset, branchColors(hotfixColors[0]))
    .microcommit(["feature-b", "feature-c", "hotfix-1"])
    .merge("0.1", "hotfix-1", fastforwardMarker)
    .tag("0.1", "0.1.1")
    .commit("hotfix-1", deleteMarker)
    .deleteRef("hotfix-1")
    .merge("rc0.2", "0.1")
    .merge("feature-b", "0.1")
    .merge("feature-c", "0.1")
    .microcommit("feature-b")
    .merge("integrate-b-c", "feature-b")
    .merge("rc0.2", "integrate-b-c")
    .microcommit(["feature-b", "feature-c"])
    .merge("integrate-b-c", "feature-c")
    .merge("rc0.2", "integrate-b-c")
    .microcommit("feature-b")
    .commit("rc0.2", deleteMarker)
    .tag("rc0.2", "Cut feature-b from 0.2")
    .deleteRef("rc0.2")
    .branch(
      "rc0.2-2",
      "0.1",
      releaseOffset + 1,
      branchColors(releaseCandidateColors[1])
    )
    .merge("rc0.2-2", "feature-c")
    .branch("0.2", "rc0.2-2", releaseOffset + 2, {
      ...branchColors(serviceLineColors[1]),
      includeBranchStart: false
    })
    .tag("0.2", "0.2.0")
    .commit("feature-c", deleteMarker)
    .deleteRef("feature-c")
    .commit("rc0.2-2", deleteMarker)
    .deleteRef("rc0.2-2")
    .merge("feature-b", "integrate-b-c")
    .commit("integrate-b-c", deleteMarker)
    .deleteRef("integrate-b-c")
    .commit("0.2", { ...fastforwardMarker, time: 0.1 })
    .merge("feature-b", "0.2")
    .microcommit("feature-b")
    .branch(
      "rc0.3-1",
      "0.2",
      releaseOffset + 3,
      branchColors(releaseCandidateColors[2])
    )
    .merge("rc0.3-1", "feature-b")
    .branch("hotfix-2", "0.1", hotfixOffset, branchColors(hotfixColors[0]))
    .microcommit("hotfix-2")
    .merge("0.1", "hotfix-2", fastforwardMarker)
    .tag("0.1", "0.1.2")
    .commit("hotfix-2", deleteMarker)
    .deleteRef("hotfix-2")
    .merge("0.2", "0.1", fastforwardMarker)
    .merge("feature-b", "0.2")
    .merge("rc0.3-1", "0.2")
    .merge("rc0.3-1", "feature-b")
    .branch(
      "0.3",
      "rc0.3-1",
      releaseOffset + 4,
      branchColors(serviceLineColors[2])
    )
    .tag("0.3", "0.3.0")
    .commit("rc0.3-1", deleteMarker)
    .deleteRef("rc0.3-1")
    .commit("feature-b", deleteMarker)
    .deleteRef("feature-b")
    .render();
}

function featureFromServiceLineSection(
  git: GitRepository,
  { serviceLine }: ExistingBranches<"serviceLine">,
  { feature }: NewBranches<"feature">
) {
  return git
    .branch(feature.name, serviceLine, feature.row, feature.theme)
    .microcommit(feature.name, {}, 7);
}

export function featureFromServiceLine() {
  featureFromServiceLineSection(
    makeGraph("feature", {}, [
      { name: "1.0", row: 1, theme: branchColors(serviceLineColors[0]) }
    ]).adjustTime(0.5),
    { serviceLine: "1.0" },
    {
      feature: {
        name: "feature-a",
        row: 0,
        theme: branchColors(featureColors[0])
      }
    }
  ).render();
}

function releaseCandidateFromFeaturesSection(
  git: GitRepository,
  { rc, featureA, featureB }: ExistingBranches<"rc" | "featureA" | "featureB">
) {
  return git
    .microcommit([featureA, featureB], {}, 2)
    .merge(rc, featureA)
    .merge(rc, featureB)
    .microcommit(featureB, {}, 2)
    .merge(rc, featureB);
}

export function releaseCandidateFromFeatures() {
  releaseCandidateFromFeaturesSection(
    makeGraph("releaseCandidateFromFeatures", {}, [
      { name: "feature-a", row: 0, theme: branchColors(featureColors[0]) },
      { name: "feature-b", row: 1, theme: branchColors(featureColors[1]) },
      {
        name: "rc1.1",
        row: 2,
        theme: branchColors(releaseCandidateColors[0])
      }
    ]).adjustTime(0.5),
    { rc: "rc1.1", featureA: "feature-a", featureB: "feature-b" }
  ).render();
}

function serviceLineFromReleaseCandidateSection(
  git: GitRepository,
  { rc }: ExistingBranches<"rc">,
  { serviceLine, rc2 }: NewBranches<"serviceLine" | "rc2">,
  serviceLineTags: [string, string]
) {
  return git
    .commit(rc)
    .branch(serviceLine.name, rc, serviceLine.row, serviceLine.theme)
    .tag(serviceLine.name, serviceLineTags[0])
    .commit(rc, deleteMarker)
    .deleteRef(rc)
    .branch(rc2.name, serviceLine.name, rc2.row, rc2.theme)
    .commit(rc2.name)
    .commit(rc2.name)
    .merge(serviceLine.name, rc2.name, fastforwardMarker)
    .tag(serviceLine.name, serviceLineTags[1])
    .commit(rc2.name, deleteMarker)
    .deleteRef(rc2.name);
}

export function serviceLineFromReleaseCandidate() {
  serviceLineFromReleaseCandidateSection(
    makeGraph("serviceLineFromReleaseCandidate", {}, [
      {
        name: "rc1.1",
        row: 0,
        theme: branchColors(releaseCandidateColors[0])
      }
    ]),
    { rc: "rc1.1" },
    {
      serviceLine: {
        name: "1.1",
        row: 1,
        theme: branchColors(serviceLineColors[0])
      },
      rc2: {
        name: "rc1.1.1",
        row: 0,
        theme: branchColors(releaseCandidateColors[1])
      }
    },
    ["1.1.0", "1.1.1"]
  ).render();
}

function serviceLineHotfixSection(
  git: GitRepository,
  { serviceLine }: ExistingBranches<"serviceLine">,
  { hotfix }: NewBranches<"hotfix">,
  serviceLineTags: [string]
) {
  return git
    .branch(hotfix.name, serviceLine, hotfix.row, hotfix.theme)
    .microcommit(hotfix.name, {}, 3)
    .merge(serviceLine, hotfix.name, fastforwardMarker)
    .tag(serviceLine, serviceLineTags[0])
    .commit(hotfix.name, deleteMarker)
    .deleteRef(hotfix.name);
}

export function serviceLineHotfix() {
  serviceLineHotfixSection(
    makeGraph("serviceLineHotfix", {}, [
      {
        name: "1.1",
        row: 0,
        theme: branchColors(serviceLineColors[0])
      }
    ]),
    { serviceLine: "1.1" },
    {
      hotfix: {
        name: "hotfix-1",
        row: 1,
        theme: branchColors(hotfixColors[0])
      }
    },
    ["1.1.2"]
  ).render();
}

function infrastructureSection(
  git: GitRepository,
  { infrastructure }: ExistingBranches<"infrastructure">,
  { featureA, featureB }: NewBranches<"featureA" | "featureB">
) {
  return git
    .microcommit(infrastructure)
    .branch(featureA.name, infrastructure, featureA.row, featureA.theme)
    .microcommit(featureA.name, {}, 1)
    .branch(featureB.name, infrastructure, featureB.row, featureB.theme)
    .microcommit([featureB.name, featureA.name], {}, 1)
    .microcommit([featureB.name, featureA.name, infrastructure], {}, 1)
    .merge(featureA.name, infrastructure)
    .merge(featureB.name, infrastructure);
}

export function infrastructure() {
  infrastructureSection(
    makeGraph("infrastructure", {}, [
      { name: "infrastructure", row: 0, theme: branchColors(featureColors[3]) }
    ]),
    { infrastructure: "infrastructure" },
    {
      featureA: {
        name: "feature-a",
        row: 2,
        theme: branchColors(featureColors[0])
      },
      featureB: {
        name: "feature-b",
        row: 1,
        theme: branchColors(featureColors[0])
      }
    }
  ).render();
}

function integrationPrerequisiteSection(
  git: GitRepository,
  { infrastructure, featureA }: ExistingBranches<"infrastructure" | "featureA">,
  { integration, featureB }: NewBranches<"integration" | "featureB">
) {
  return git
    .branch(
      integration.name,
      infrastructure,
      integration.row,
      integration.theme
    )
    .merge(integration.name, featureA)
    .branch(featureB.name, integration.name, featureB.row, featureB.theme)
    .microcommit(infrastructure, {}, 1)
    .merge(integration.name, infrastructure)
    .merge(featureB.name, integration.name);
}

export function integrationPrerequisite() {
  integrationPrerequisiteSection(
    makeGraph("integrationPrerequisite", {}, [
      { name: "feature-a", row: 0, theme: branchColors(featureColors[0]) },
      { name: "infrastructure", row: 1, theme: branchColors(featureColors[3]) }
    ]).adjustTime(1),
    {
      infrastructure: "infrastructure",
      featureA: "feature-a"
    },
    {
      featureB: {
        name: "feature-b",
        row: 3,
        theme: branchColors(featureColors[2])
      },
      integration: {
        name: "integration",
        row: 2,
        theme: branchColors(integrationBranchColors[0])
      }
    }
  ).render();
}

function integrationReleaseCandidateSection(
  git: GitRepository,
  { featureA, featureB, rc }: ExistingBranches<"featureA" | "featureB" | "rc">,
  { integration }: NewBranches<"integration">
) {
  return git
    .merge(rc, featureB)
    .commit(featureA, conflictMarker)
    .branch(integration.name, featureB, integration.row, integration.theme)
    .merge(integration.name, featureA)
    .merge(rc, integration.name);
}

export function integrationReleaseCandidate() {
  integrationReleaseCandidateSection(
    makeGraph("integrationReleaseCandidate", {}, [
      { name: "feature-a", row: 0, theme: branchColors(featureColors[0]) },
      { name: "feature-b", row: 1, theme: branchColors(featureColors[1]) },
      { name: "rc1.2", row: 3, theme: branchColors(releaseCandidateColors[0]) }
    ]).adjustTime(1),
    {
      featureA: "feature-a",
      featureB: "feature-b",
      rc: "rc1.2"
    },
    {
      integration: {
        name: "integration",
        row: 2,
        theme: branchColors(integrationBranchColors[1])
      }
    }
  ).render();
}

function integrationFullSection(
  git: GitRepository,
  {
    infrastructure,
    featureA,
    featureB,
    rc
  }: ExistingBranches<"infrastructure" | "featureA" | "featureB" | "rc">,
  {
    integrationA,
    integrationB,
    featureC
  }: NewBranches<"integrationA" | "integrationB" | "featureC">
) {
  git.merge(rc, featureA);
  integrationPrerequisiteSection(
    git,
    {
      infrastructure,
      featureA
    },
    {
      featureB: featureC,
      integration: integrationA
    }
  );
  integrationReleaseCandidateSection(
    git,
    { featureB: featureB, featureA: featureC.name, rc },
    { integration: integrationB }
  );
  return git;
}

export function integrationFull() {
  integrationFullSection(
    makeGraph("integrationFull", {}, [
      { name: "feature-a", row: 0, theme: branchColors(featureColors[0]) },
      { name: "infrastructure", row: 1, theme: branchColors(featureColors[3]) },
      { name: "feature-b", row: 4, theme: branchColors(featureColors[1]) },
      { name: "rc1.2", row: 6, theme: branchColors(releaseCandidateColors[0]) }
    ]).adjustTime(1),
    {
      infrastructure: "infrastructure",
      featureA: "feature-a",
      featureB: "feature-b",
      rc: "rc1.2"
    },
    {
      featureC: {
        name: "feature-c",
        row: 3,
        theme: branchColors(featureColors[2])
      },
      integrationA: {
        name: "integration-a",
        row: 2,
        theme: branchColors(integrationBranchColors[0])
      },
      integrationB: {
        name: "integration-b",
        row: 5,
        theme: branchColors(integrationBranchColors[1])
      }
    }
  ).render();
}

export function mainFlow() {
  const rc = "rc1.1";
  const serviceLine = {
    name: "1.1",
    row: 4,
    theme: branchColors(serviceLineColors[0])
  };
  const serviceLineTags = ["1.1.0"];
  releaseCandidateFromFeaturesSection(
    makeGraph("releaseCandidateFromFeatures", {}, [
      { name: "infrastructure", row: 0, theme: branchColors(featureColors[3]) }
    ])
      .adjustTime(0.5)
      .microcommit("infrastructure")
      .branch("feature-a", "infrastructure", 2, branchColors(featureColors[0]))
      .branch("feature-b", "infrastructure", 1, branchColors(featureColors[0]))
      .microcommit(["feature-a", "feature-b"])
      .branch(rc, "feature-a", 3, branchColors(releaseCandidateColors[0])),
    { rc: "rc1.1", featureA: "feature-a", featureB: "feature-b" }
  )
    .branch(serviceLine.name, rc, serviceLine.row, serviceLine.theme)
    .tag(serviceLine.name, serviceLineTags[0])
    .commit(rc, deleteMarker)
    .deleteRef(rc)
    .commit("feature-a", deleteMarker)
    .deleteRef("feature-a")
    .commit("feature-b", deleteMarker)
    .deleteRef("feature-b")
    .commit("infrastructure", deleteMarker)
    .deleteRef("infrastructure")
    .render();
}

export function betterGit() {
  featureFromServiceLine();
  releaseCandidateFromFeatures();
  serviceLineFromReleaseCandidate();
  serviceLineHotfix();
  infrastructure();
  integrationReleaseCandidate();
  mainFlow();
  integrationPrerequisite();
  integrationFull();
  gettingStartedFull();
}
