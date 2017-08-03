import {
  twoFeature,
  threeFeature,
  twoFeatureIncremental,
  twoFeatureInfrastructure,
  threeFeatureMultiRelease,
  newRelease,
  hotfixRelease,
  fullFeature
} from "./samples/originals";
import { prettier } from "./samples/code-formatting-infrastructure";

twoFeature("horizontal");
twoFeature("vertical");
threeFeature();
twoFeatureIncremental();
twoFeatureInfrastructure();
threeFeatureMultiRelease();
newRelease();
hotfixRelease();
fullFeature();
prettier();
