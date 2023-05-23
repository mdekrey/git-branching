// import { Theme } from "../gitChart";
import {
  branchColors /*deleteMarker*/,
  deleteMarker,
  conflictMarker,
  fastforwardMarker
} from "../theme/theming";
import {
  serviceLineColors,
  featureColors,
  releaseCandidateColors,
  integrationBranchColors
  //   hotfixColors
} from "../theme/colors";
import { makeGraph } from "../graph-builder";

export function notebookTagging() {
  const git = makeGraph("notebookTagging", {}, [
    {
      name: "line/6.0-future",
      row: 0,
      theme: branchColors(serviceLineColors[0])
    }
  ]);
  git
    .adjustTime(1)
    .branch("notebooks", "line/6.0-future", 2, branchColors(featureColors[0]))
    .microcommit("notebooks", {}, 6)
    .adjustTime(-2)
    .branch("tags", "line/6.0-future", 1, branchColors(featureColors[1]))
    .microcommit("tags", {}, 4)
    .commit("notebooks")
    .branch(
      "rc/6.0-next",
      "notebooks",
      4,
      branchColors(releaseCandidateColors[0])
    )
    .merge("rc/6.0-next", "tags")
    .adjustTime(-1)
    // initial setup complete
    .commit("notebooks")
    .merge("rc/6.0-next", "notebooks")
    .branch("notebook-tagging", "notebooks", 3, branchColors(featureColors[2]))
    .adjustTime(-0.5)
    .merge("notebook-tagging", "tags")
    .microcommit("notebook-tagging", {}, 4)
    .adjustTime(-0.25)
    // approve and consolidate
    .merge("line/6.0-future", "rc/6.0-next", fastforwardMarker)
    .commit("notebooks", deleteMarker)
    .deleteRef("notebooks")
    .commit("tags", deleteMarker)
    .deleteRef("tags")
    .commit("rc/6.0-next", deleteMarker)
    .deleteRef("rc/6.0-next")
    .tag("line/6.0-future", "line/6.0-future-sprint-4")
    .adjustTime(-0.25)
    .merge("notebook-tagging", "line/6.0-future")
    .render();
}

export function notebookTaggingIntegration() {
  const git = makeGraph("notebookTaggingIntegration", {}, [
    {
      name: "line/6.0-future",
      row: 0,
      theme: branchColors(serviceLineColors[0])
    }
  ]);
  git
    .adjustTime(1)
    .branch("notebooks", "line/6.0-future", 2, branchColors(featureColors[0]))
    .microcommit("notebooks", {}, 6)
    .adjustTime(-2)
    .branch("tags", "line/6.0-future", 1, branchColors(featureColors[1]))
    .microcommit("tags", {}, 4)
    .commit("notebooks")
    .branch(
      "rc/6.0-next",
      "notebooks",
      5,
      branchColors(releaseCandidateColors[0])
    )
    .merge("rc/6.0-next", "tags")
    .adjustTime(-1)
    // initial setup complete
    .commit("notebooks")
    .branch(
      "merge/notebooks/tags",
      "notebooks",
      3,
      branchColors(integrationBranchColors[0])
    )
    .commit("rc/6.0-next", conflictMarker)
    .merge("merge/notebooks/tags", "tags")
    .merge("rc/6.0-next", "merge/notebooks/tags")
    .branch("notebook-tagging", "notebooks", 4, branchColors(featureColors[2]))
    .adjustTime(-0.25)
    .merge("notebook-tagging", "merge/notebooks/tags")
    .microcommit("notebook-tagging", {}, 4)
    .adjustTime(-0.25)
    // approve and consolidate
    .merge("line/6.0-future", "rc/6.0-next", fastforwardMarker)
    .commit("notebooks", deleteMarker)
    .deleteRef("notebooks")
    .commit("tags", deleteMarker)
    .deleteRef("tags")
    .commit("rc/6.0-next", deleteMarker)
    .deleteRef("rc/6.0-next")
    .tag("line/6.0-future", "line/6.0-future-sprint-4")
    .adjustTime(-0.25)
    .merge("merge/notebooks/tags", "line/6.0-future", fastforwardMarker)
    .merge("notebook-tagging", "merge/notebooks/tags")
    .commit("merge/notebooks/tags", deleteMarker)
    .deleteRef("merge/notebooks/tags")
    .render();
}

export function brainspace() {
  notebookTagging();
  notebookTaggingIntegration();
}
