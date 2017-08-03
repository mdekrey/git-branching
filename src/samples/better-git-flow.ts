import {
  branchColors,
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

export function fullExample() {
  makeGraph(
    "fullBetterGit",
    {
      direction: "vertical",
      timeDistance: 40
    },
    [{ name: "infrastructure", row: 3, theme: branchColors(featureColors[3]) }]
  )
    .adjustTime(2)
    .branch("feature-a", "infrastructure", 1, branchColors(featureColors[0]))
    .microcommit("feature-a")
    .branch("feature-b", "infrastructure", 0, branchColors(featureColors[1]))
    .microcommit("feature-b")
    .microcommit("feature-a")
    .branch(
      "rc0.1-1",
      "infrastructure",
      4,
      branchColors(releaseCandidateColors[0])
    )
    .merge("rc0.1-1", "feature-a")
    .branch("0.1", "rc0.1-1", 5, {
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
    .branch("feature-c", "0.1", 3, branchColors(featureColors[2]))
    .microcommit("feature-c")
    .branch("rc0.2-1", "0.1", 6, branchColors(releaseCandidateColors[1]))
    .merge("rc0.2-1", "feature-b")
    .merge("rc0.2-1", "feature-c")
    .branch("hotfix-1", "0.1", 4, branchColors(hotfixColors[0]))
    .microcommit("hotfix-1")
    .merge("0.1", "hotfix-1", fastforwardMarker)
    .tag("0.1", "0.1.1")
    .commit("hotfix-1", deleteMarker)
    .deleteRef("hotfix-1")
    .merge("rc0.2-1", "0.1")
    .merge("feature-b", "0.1")
    .merge("feature-c", "0.1")
    .microcommit("feature-b")
    .merge("rc0.2-1", "feature-b")
    .merge("rc0.2-1", "feature-c")
    .microcommit("feature-b")
    .commit("rc0.2-1", deleteMarker)
    .tag("rc0.2-1", "Cut feature-b from 0.2")
    .deleteRef("rc0.2-1")
    .branch("rc0.2-2", "0.1", 6, branchColors(releaseCandidateColors[1]))
    .merge("rc0.2-2", "feature-c")
    .branch("0.2", "rc0.2-2", 7, {
      ...branchColors(serviceLineColors[1]),
      includeBranchStart: false
    })
    .tag("0.2", "0.2.0")
    .commit("feature-c", deleteMarker)
    .deleteRef("feature-c")
    .commit("rc0.2-2", deleteMarker)
    .deleteRef("rc0.2-2")
    .merge("feature-b", "0.2")
    .microcommit("feature-b")
    .branch("rc0.3-1", "0.2", 8, branchColors(releaseCandidateColors[2]))
    .merge("rc0.3-1", "feature-b")
    .branch("hotfix-2", "0.1", 4, branchColors(hotfixColors[0]))
    .microcommit("hotfix-2")
    .merge("0.1", "hotfix-2", fastforwardMarker)
    .tag("0.1", "0.1.2")
    .commit("hotfix-2", deleteMarker)
    .deleteRef("hotfix-2")
    .merge("0.2", "0.1", fastforwardMarker)
    .merge("feature-b", "0.2")
    .merge("rc0.3-1", "0.2")
    .merge("rc0.3-1", "feature-b")
    .branch("0.3", "rc0.3-1", 9, branchColors(serviceLineColors[2]))
    .tag("0.3", "0.3.0")
    .commit("rc0.3-1", deleteMarker)
    .deleteRef("rc0.3-1")
    .commit("feature-b", deleteMarker)
    .deleteRef("feature-b")
    .render();
}
