import { makeGraph } from "../graph-builder";
import { branchColors } from "../theme/theming";
import { releaseColors, featureColors } from "../theme/colors";
import { Commit } from "../gitChart";

export function prettier() {
  const gitgraph = makeGraph("prettier", "horizontal", [
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
