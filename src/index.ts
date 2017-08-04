import { allOriginalSamples } from "./samples/originals";
import { prettier } from "./samples/code-formatting-infrastructure";
import { gettingStartedFull } from "./samples/better-git-flow";

function buildHeader(title: string) {
  const header = document.createElement("h1");
  header.innerText = title;
  document.body.appendChild(header);
}

buildHeader("Example");
gettingStartedFull();
buildHeader("Original Samples");
allOriginalSamples();
buildHeader("Prettier");
prettier();
