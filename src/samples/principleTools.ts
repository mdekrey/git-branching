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

export function releases() {
    const rc = "rc/2022-07-14";
    const serviceLine = {
        name: "main",
        row: 0,
        theme: branchColors(serviceLineColors[0])
    };
    const serviceLineTags = ["2022-07-14"];
    const featureA = "feature/PS-123";
    const featureB = "feature/BA-17";
    const infrastructure = "infra/refactor";
    releaseCandidateFromFeaturesSection(
        makeGraph("releaseCandidateFromFeatures", {}, [
            serviceLine,
            { name: infrastructure, row: 1, theme: branchColors(featureColors[3]) }
        ])
            .adjustTime(0.5)
            .microcommit(infrastructure)
            .branch(featureA, infrastructure, 3, branchColors(featureColors[0]))
            .branch(featureB, serviceLine.name, 2, branchColors(featureColors[0]))
            .microcommit([featureA, featureB])
            .branch(rc, serviceLine.name, 4, branchColors(releaseCandidateColors[0])),
        { rc, featureA: featureA, featureB: featureB }
    )
        .merge(serviceLine.name, rc)
        .tag(serviceLine.name, serviceLineTags[0])
        .commit(rc, deleteMarker)
        .deleteRef(rc)
        .commit(featureA, deleteMarker)
        .deleteRef(featureA)
        .commit(featureB, deleteMarker)
        .deleteRef(featureB)
        .commit(infrastructure, deleteMarker)
        .deleteRef(infrastructure)
        .render();
}

export function releaseIntegration() {
    const rc = "rc/2022-07-14";
    const rc1 = "rc/2022-07-14.1";
    const serviceLine = {
        name: "main",
        row: 0,
        theme: branchColors(serviceLineColors[0])
    };
    const integration = "integration/BA-17/PS-123";
    const serviceLineTags = ["2022-07-14"];
    const featureA = "feature/PS-123";
    const featureB = "feature/BA-17";
    integrationReleaseCandidateSection(
        makeGraph("reintegrateIntegration", {}, [serviceLine])
            .adjustTime(0.5)
            // .microcommit(infrastructure)
            .branch(featureA, serviceLine.name, 2, branchColors(featureColors[0]))
            .branch(featureB, serviceLine.name, 1, branchColors(featureColors[0]))
            .microcommit([featureA, featureB])
            .branch(rc, serviceLine.name, 4, branchColors(releaseCandidateColors[0])),
        { rc, featureA: featureA, featureB: featureB },
        {
            integration: {
                name: integration,
                row: 3,
                theme: branchColors(integrationBranchColors[0])
            }
        }
    )
        .deleteRef(rc)
        .branch(rc1, serviceLine.name, 4, branchColors(releaseCandidateColors[1]))
        .merge(rc1, featureA)

        .merge(serviceLine.name, rc1)
        .tag(serviceLine.name, serviceLineTags[0])
        .commit(rc1, deleteMarker)
        .deleteRef(rc1)
        .commit(featureA, deleteMarker)
        .deleteRef(featureA)
        .merge(featureB, integration)
        .commit(integration, deleteMarker)
        .merge(featureB, serviceLine.name)
        .deleteRef(integration)
        // .commit(infrastructure, deleteMarker)
        // .deleteRef(infrastructure)
        .render();
}

export function principleTools() {
    releases();
    releaseIntegration();
}
