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

function createReleaseCandidatesSection(
  git: GitRepository,
  { serviceLine1 }: ExistingBranches<"serviceLine1">,
  {
    rc1,
    rc2,
    rc3,
    serviceLine2
  }: NewBranches<"rc1" | "rc2" | "rc3" | "serviceLine2">,
  serviceLine1Tags: string[],
  serviceLine2Tags: string[]
) {
  return git
    .branch(rc1.name, serviceLine1, rc1.row, rc1.theme)
    .branch(rc2.name, rc1.name, rc2.row, rc2.theme)
    .microcommit([rc1.name, rc2.name])
    .merge(rc2.name, rc1.name)
    .microcommit(rc2.name)
    .adjustTime(-0.5)
    .merge(serviceLine1, rc1.name, fastforwardMarker)
    .tag(serviceLine1, serviceLine1Tags[0])
    .commit(rc1.name, deleteMarker)
    .deleteRef(rc1.name)
    .merge(rc2.name, serviceLine1)
    .microcommit(rc2.name)
    .branch(serviceLine2.name, rc2.name, serviceLine2.row, serviceLine2.theme)
    .commit(rc2.name, deleteMarker)
    .deleteRef(rc2.name)
    .tag(serviceLine2.name, serviceLine2Tags[0])
    .adjustTime(0.6)
    .branch(rc3.name, serviceLine2.name, rc3.row, rc3.theme)
    .microcommit(rc3.name)
    .merge(serviceLine2.name, rc3.name, fastforwardMarker)
    .commit(rc3.name, deleteMarker)
    .deleteRef(rc3.name)
    .tag(serviceLine2.name, serviceLine2Tags[1]);
}

export function createReleaseCandidates() {
  createReleaseCandidatesSection(
    makeGraph("createReleaseCandidates", {}, [
      { name: "1.0", row: 0, theme: branchColors(serviceLineColors[0]) }
    ]).adjustTime(1),
    {
      serviceLine1: "1.0"
    },
    {
      rc1: {
        name: "rc1.0.1",
        row: 1,
        theme: branchColors(releaseCandidateColors[0])
      },
      rc2: {
        name: "rc1.1.0",
        row: 2,
        theme: branchColors(releaseCandidateColors[1])
      },
      serviceLine2: {
        name: "1.1",
        row: 3,
        theme: branchColors(serviceLineColors[1])
      },
      rc3: {
        name: "rc1.1.1",
        row: 4,
        theme: branchColors(releaseCandidateColors[2])
      }
    },
    ["1.0.1"],
    ["1.1.0", "1.1.1"]
  ).render();
}

function updateReleaseCandidatesSection(
  git: GitRepository,
  {
    featureA,
    featureB,
    featureC,
    rc1
  }: ExistingBranches<"featureA" | "featureB" | "featureC" | "rc1">,
  { rc2 }: NewBranches<"rc2">
) {
  return git
    .branch(rc2.name, rc1, rc2.row, rc2.theme)
    .merge(rc2.name, featureC)
    .microcommit(featureC)
    .merge(rc2.name, featureC)
    .microcommit(featureA)
    .merge(rc1, featureA)
    .merge(rc2.name, rc1)
    .microcommit(featureB)
    .merge(rc1, featureB)
    .merge(rc2.name, rc1);
}

export function updateReleaseCandidates() {
  updateReleaseCandidatesSection(
    makeGraph("updateReleaseCandidates", {}, [
      { name: "feature-a", row: 0, theme: branchColors(featureColors[0]) },
      { name: "feature-b", row: 1, theme: branchColors(featureColors[1]) },
      {
        name: "rc1.0.1",
        row: 2,
        theme: branchColors(releaseCandidateColors[0])
      },
      { name: "feature-c", row: 3, theme: branchColors(featureColors[1]) }
    ]).adjustTime(1),
    {
      featureA: "feature-a",
      featureB: "feature-b",
      rc1: "rc1.0.1",
      featureC: "feature-c"
    },
    {
      rc2: {
        name: "rc1.1.0",
        row: 4,
        theme: branchColors(releaseCandidateColors[1])
      }
    }
  ).render();
}

function approveReleaseCandidateSection(
  git: GitRepository,
  {
    featureA,
    rc1,
    serviceLine1
  }: ExistingBranches<"featureA" | "rc1" | "serviceLine1">,
  serviceLine1Tags: string[]
) {
  return git
    .merge(rc1, featureA)
    .merge(serviceLine1, rc1, fastforwardMarker)
    .commit(featureA, deleteMarker)
    .deleteRef(featureA)
    .commit(rc1, deleteMarker)
    .deleteRef(rc1)
    .tag(serviceLine1, serviceLine1Tags[0]);
}

export function approveReleaseCandidate() {
  approveReleaseCandidateSection(
    makeGraph("approveReleaseCandidate", {}, [
      { name: "feature-a", row: 0, theme: branchColors(featureColors[0]) },
      {
        name: "rc1.0.2",
        row: 1,
        theme: branchColors(releaseCandidateColors[0])
      },
      { name: "1.0", row: 2, theme: branchColors(serviceLineColors[0]) }
    ]).adjustTime(1),
    {
      rc1: "rc1.0.2",
      featureA: "feature-a",
      serviceLine1: "1.0"
    },
    ["1.0.2", "1.0.3"]
  ).render();
}

function updateServiceLineSection(
  git: GitRepository,
  {
    featureA,
    rc1,
    serviceLine1
  }: ExistingBranches<"featureA" | "rc1" | "serviceLine1">,
  {
    featureB,
    featureC,
    rc2,
    rc3,
    integrateAB,
    serviceLine2
  }: NewBranches<
    "featureB" | "featureC" | "rc2" | "rc3" | "serviceLine2" | "integrateAB"
  >,
  serviceLine1Tags: string[],
  serviceLine2Tags: string[]
) {
  return git
    .merge(rc1, featureA)
    .branch(featureB.name, serviceLine1, featureB.row, featureB.theme)
    .microcommit(featureB.name, {}, 1)
    .branch(rc2.name, serviceLine1, rc2.row, rc2.theme)
    .merge(rc2.name, featureB.name)
    .branch(serviceLine2.name, rc2.name, serviceLine2.row, serviceLine2.theme)
    .commit(featureB.name, deleteMarker)
    .deleteRef(featureB.name)
    .commit(rc2.name, deleteMarker)
    .deleteRef(rc2.name)
    .tag(serviceLine2.name, serviceLine2Tags[0])
    .branch(featureC.name, serviceLine1, featureC.row, featureC.theme)
    .microcommit(featureC.name, {}, 1)
    .branch(rc3.name, rc1, rc3.row, rc3.theme)
    .commit(featureC.name, conflictMarker)
    .branch(integrateAB.name, featureA, integrateAB.row, integrateAB.theme)
    .merge(integrateAB.name, featureC.name)
    .merge(rc3.name, integrateAB.name)
    .merge(serviceLine1, rc1, fastforwardMarker)
    .commit(featureA, deleteMarker)
    .deleteRef(featureA)
    .commit(rc1, deleteMarker)
    .deleteRef(rc1)
    .tag(serviceLine1, serviceLine1Tags[0])
    .adjustTime(-0.25)
    .merge(serviceLine2.name, serviceLine1)
    .merge(featureC.name, integrateAB.name)
    .commit(integrateAB.name, deleteMarker)
    .deleteRef(integrateAB.name)
    .merge(featureC.name, serviceLine1)
    .merge(rc3.name, serviceLine1)
    .merge(rc3.name, featureC.name);
}

export function updateServiceLine() {
  updateServiceLineSection(
    makeGraph("updateServiceLine", {}, [
      { name: "feature-a", row: 0, theme: branchColors(featureColors[0]) },
      {
        name: "rc1.0.2",
        row: 1,
        theme: branchColors(releaseCandidateColors[0])
      },
      { name: "1.0", row: 5, theme: branchColors(serviceLineColors[0]) }
    ]).adjustTime(1),
    {
      rc1: "rc1.0.2",
      featureA: "feature-a",
      serviceLine1: "1.0"
    },
    {
      rc2: {
        name: "rc1.1.0",
        row: 7,
        theme: branchColors(releaseCandidateColors[1])
      },
      serviceLine2: {
        name: "1.1",
        row: 8,
        theme: branchColors(serviceLineColors[1])
      },
      rc3: {
        name: "rc1.0.3",
        row: 4,
        theme: branchColors(releaseCandidateColors[2])
      },
      featureB: {
        name: "feature-b",
        row: 6,
        theme: branchColors(featureColors[1])
      },
      featureC: {
        name: "feature-c",
        row: 2,
        theme: branchColors(featureColors[2])
      },
      integrateAB: {
        name: "integration-a-c",
        row: 3,
        theme: branchColors(integrationBranchColors[2])
      }
    },
    ["1.0.2", "1.0.3"],
    ["1.1.0"]
  ).render();
}

function rebuildReleaseCandidateSection(
  git: GitRepository,
  { serviceLine1 }: ExistingBranches<"serviceLine1">,
  {
    featureA,
    featureB,
    featureC,
    integrationBC,
    rc1,
    serviceLine2
  }: NewBranches<
    | "featureA"
    | "featureB"
    | "featureC"
    | "integrationBC"
    | "rc1"
    | "serviceLine2"
  >,
  serviceLine2Tags: string[]
) {
  return git
    .branch(featureA.name, serviceLine1, featureA.row, featureA.theme)
    .branch(featureB.name, serviceLine1, featureB.row, featureB.theme)
    .branch(featureC.name, serviceLine1, featureC.row, featureC.theme)
    .microcommit([featureA.name, featureB.name, featureC.name])
    .branch(rc1.name, serviceLine1, rc1.row, rc1.theme)
    .merge(rc1.name, featureA.name)
    .merge(rc1.name, featureB.name)
    .commit(featureC.name, conflictMarker)
    .branch(
      integrationBC.name,
      featureC.name,
      integrationBC.row,
      integrationBC.theme
    )
    .merge(integrationBC.name, featureB.name)
    .merge(rc1.name, integrationBC.name)
    .adjustTime(0.5)
    .commit(rc1.name, deleteMarker)
    .deleteRef(rc1.name)
    .branch(rc1.name, serviceLine1, rc1.row, rc1.theme)
    .merge(rc1.name, featureA.name)
    .merge(rc1.name, featureB.name)
    .branch(serviceLine2.name, rc1.name, serviceLine2.row, serviceLine2.theme)
    .tag(serviceLine2.name, serviceLine2Tags[0])
    .commit(serviceLine1, deleteMarker)
    .deleteRef(serviceLine1)
    .commit(rc1.name, deleteMarker)
    .deleteRef(rc1.name)
    .commit(featureA.name, deleteMarker)
    .deleteRef(featureA.name)
    .commit(featureB.name, deleteMarker)
    .deleteRef(featureB.name)
    .merge(featureC.name, integrationBC.name)
    .commit(integrationBC.name, deleteMarker)
    .deleteRef(integrationBC.name)
    .merge(featureC.name, serviceLine2.name);
}

export function rebuildReleaseCandidate() {
  rebuildReleaseCandidateSection(
    makeGraph("rebuildReleaseCandidate", {}, [
      {
        name: "0.1.0-beta",
        row: 5,
        theme: branchColors(serviceLineColors[0])
      }
    ]).adjustTime(1),
    {
      serviceLine1: "0.1.0-beta"
    },
    {
      featureA: {
        name: "feature-a",
        row: 0,
        theme: branchColors(featureColors[0])
      },
      featureB: {
        name: "feature-b",
        row: 1,
        theme: branchColors(featureColors[1])
      },
      featureC: {
        name: "feature-c",
        row: 2,
        theme: branchColors(featureColors[2])
      },
      integrationBC: {
        name: "integration-b-c",
        row: 3,
        theme: branchColors(integrationBranchColors[0])
      },
      rc1: {
        name: "rc1.0.0",
        row: 4,
        theme: branchColors(releaseCandidateColors[0])
      },
      serviceLine2: {
        name: "1.0",
        row: 6,
        theme: branchColors(serviceLineColors[1])
      }
    },
    ["1.0.0"]
  ).render();
}

export function mainFlow() {
  const rc = "rc1.1";
  const serviceLine = {
    name: "1.1",
    row: 5,
    theme: branchColors(serviceLineColors[1])
  };
  const serviceLineTags = ["1.1.0"];
  releaseCandidateFromFeaturesSection(
    makeGraph("releaseCandidateFromFeatures", {}, [
      { name: "1.0", row: 0, theme: branchColors(serviceLineColors[0]) },
      { name: "infrastructure", row: 1, theme: branchColors(featureColors[3]) }
    ])
      .adjustTime(0.5)
      .microcommit("infrastructure")
      .branch("feature-a", "infrastructure", 3, branchColors(featureColors[0]))
      .branch("feature-b", "1.0", 2, branchColors(featureColors[0]))
      .microcommit(["feature-a", "feature-b"])
      .branch(rc, "1.0", 4, branchColors(releaseCandidateColors[0])),
    { rc, featureA: "feature-a", featureB: "feature-b" }
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
  createReleaseCandidates();
  updateReleaseCandidates();
  approveReleaseCandidate();
  rebuildReleaseCandidate();
  updateServiceLine();
  gettingStartedFull();
}
