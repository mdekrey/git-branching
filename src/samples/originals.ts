import { Theme } from "../gitChart";
import { branchColors, deleteMarker } from "../theme/theming";
import { releaseColors, featureColors, hotfixColors } from "../theme/colors";
import { makeGraph } from "../graph-builder";

export function twoFeature(direction: Theme["direction"]) {
  const git = makeGraph("twoFeature", direction, [
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

export function threeFeature() {
  const git = makeGraph("threeFeature", "horizontal", [
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

export function twoFeatureIncremental() {
  const git = makeGraph("twoFeatureIncremental", "horizontal", [
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

export function twoFeatureInfrastructure() {
  makeGraph("twoFeatureInfrastructure", "horizontal", [
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

export function threeFeatureMultiRelease() {
  makeGraph("threeFeatureMultiRelease", "horizontal", [
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

export function newRelease() {
  makeGraph("newRelease", "horizontal", [
    { name: "0.1", row: 1, theme: branchColors(releaseColors[0]) }
  ])
    .commit("0.1")
    .tag("0.1", "0.1.0")
    .branch("0.2", "0.1", 0, branchColors(releaseColors[1]))
    .render();
}

export function hotfixRelease() {
  makeGraph("hotfixRelease", "horizontal", [
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

export function fullFeature() {
  makeGraph("fullFeature", "horizontal", [
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
