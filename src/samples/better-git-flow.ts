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
  hotfixColors
} from "../theme/colors";
import { makeGraph } from "../graph-builder";

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
      "rc0.1-1",
      "infrastructure",
      4,
      branchColors(releaseCandidateColors[0])
    )
    .merge("rc0.1-1", "feature-a")
    .branch("0.1", "rc0.1-1", releaseOffset + 0, {
      ...branchColors(serviceLineColors[0]),
      includeBranchStart: false
    })
    .tag("0.1", "0.1.0")
    .commit("infrastructure", deleteMarker)
    .deleteRef("infrastructure")
    .commit("rc0.1-1", deleteMarker)
    .deleteRef("rc0.1-1")
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
    .branch("rc0.2-1", "0.1", 6, branchColors(releaseCandidateColors[1]))
    .merge("rc0.2-1", "feature-b")
    .commit("feature-c", conflictMarker)
    .branch(
      "integrate-b-c",
      "0.1",
      integrationOffset,
      branchColors(featureColors[4])
    )
    .merge("integrate-b-c", "feature-b")
    .merge("integrate-b-c", "feature-c")
    .merge("rc0.2-1", "integrate-b-c")
    .branch("hotfix-1", "0.1", hotfixOffset, branchColors(hotfixColors[0]))
    .microcommit(["feature-b", "feature-c", "hotfix-1"])
    .merge("0.1", "hotfix-1", fastforwardMarker)
    .tag("0.1", "0.1.1")
    .commit("hotfix-1", deleteMarker)
    .deleteRef("hotfix-1")
    .merge("rc0.2-1", "0.1")
    .merge("feature-b", "0.1")
    .merge("feature-c", "0.1")
    .microcommit("feature-b")
    .merge("integrate-b-c", "feature-b")
    .merge("rc0.2-1", "integrate-b-c")
    .microcommit(["feature-b", "feature-c"])
    .merge("integrate-b-c", "feature-c")
    .merge("rc0.2-1", "integrate-b-c")
    .microcommit("feature-b")
    .commit("rc0.2-1", deleteMarker)
    .tag("rc0.2-1", "Cut feature-b from 0.2")
    .deleteRef("rc0.2-1")
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

export function betterGit() {
  gettingStartedFull();
}
