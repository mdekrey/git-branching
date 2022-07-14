import { allOriginalSamples } from "./samples/originals";
import { prettier } from "./samples/code-formatting-infrastructure";
import { betterGit } from "./samples/better-git-flow";
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

buildHeader("Principle.Tools Single Line");
principleTools();
