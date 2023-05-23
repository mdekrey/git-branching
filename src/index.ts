import { allOriginalSamples } from "./samples/originals";
import { prettier } from "./samples/code-formatting-infrastructure";
import { betterGit } from "./samples/better-git-flow";
import { brainspace } from "./samples/brainspace";
import { principleTools } from "./samples/principleTools";

function buildHeader(title: string) {
  const header = document.createElement("h1");
  header.innerText = title;
  document.body.appendChild(header);
}

buildHeader("Example");
betterGit();
buildHeader("Original Samples");
allOriginalSamples();
buildHeader("Prettier");
prettier();
buildHeader("Brainspace");
brainspace();
buildHeader("Principle.Tools Single Line");
principleTools();
