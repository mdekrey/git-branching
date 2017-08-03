import { ColorHelper, transparent } from "csx";
import { select, Selection } from "d3-selection";
import { bind, IBindProps } from "./d3-binding";

export type Direction = "horizontal" | "vertical";

export interface Theme {
  direction: Direction;
  defaultBranchTheme: BranchTheme;

  padding: { x: number; y: number };
  timeDistance: number;
  rowDistance: number;
}

export interface BranchTheme {
  label?: string;
  strokeColor: ColorHelper;
  defaultCommitTheme: CommitTheme;
  strokeWidth: number;
  includeBranchStart: boolean;
  includeBranchEnd: boolean;
  includeMergeTime: boolean;
  textColor: ColorHelper;
  fontSize: number;
  font: string;
  textOffset: { x: number; y: number };
}

export interface CommitTheme {
  label?: string;
  specialStyle?: IBindProps<SVGElement, Commit, any, any>;
  commitSize: number;
  fillColor: ColorHelper;
  strokeColor: ColorHelper;
  strokeWidth: number;
  textColor: ColorHelper;
  fontSize: number;
  font: string;
  textOffset: { x: number; y: number };
  time: number;
}

export interface CommitParent {
  commit: Commit | null;
  branch: BranchTheme;
  /** The branch name at the time, if any. Used for labelling only. */
  branchName: string | undefined;
}

export interface Commit {
  theme: CommitTheme;
  hash?: string;
  parents: CommitParent[];
  createTime: number;
  row: number;
}

interface Ref {
  name: string;
  theme: BranchTheme;
  row: number;
}

export type Commitish = Commit | string;

export interface IInitialRef {
  name: string;
  row?: number;
  theme?: Partial<BranchTheme>;
}

const flatmap = <T, U>(source: T[], lambda: (target: T) => U[]): U[] => {
  return Array.prototype.concat.apply([], source.map(lambda));
};
const rad2deg = (rad: number) => rad / Math.PI * 180;

export class GitRepository {
  private readonly element: Selection<SVGElement, {}, null, undefined>;
  private readonly allCommits = new Set<Commit>();
  private readonly currentRefs = new Map<
    string,
    { ref: Ref; current: Commit | null }
  >();
  private readonly tags = new Map<string, Commit>();
  private currentTime = 0;

  constructor(
    svgElement: SVGElement,
    private chartTheme: Theme,
    initialBranches: IInitialRef[] = []
  ) {
    this.element = select(svgElement);
    initialBranches.forEach((branch, index) =>
      this.addBranch(branch.name, branch.row || index, branch.theme)
    );
  }

  adjustTime(time: number) {
    this.currentTime += time;
    return this;
  }

  private addBranch(
    branchName: string,
    row: number,
    theme?: Partial<BranchTheme>,
    current?: Commit | null
  ) {
    const finalTheme = Object.assign(
      {},
      this.chartTheme.defaultBranchTheme,
      theme || {}
    );
    const ref: Ref = {
      name: branchName,
      theme: finalTheme,
      row
    };
    this.currentRefs.set(ref.name, {
      ref,
      current: current || null
    });
  }

  private resolveCommitish(target: Commitish) {
    return typeof target === "string"
      ? this.currentRefs.get(target)!.current!
      : target;
  }

  branch(
    branchName: string,
    from: Commitish,
    row?: number,
    theme?: Partial<BranchTheme>
  ) {
    const finalTheme = Object.assign(
      {},
      this.chartTheme.defaultBranchTheme,
      theme || {}
    );

    if (finalTheme.includeBranchStart && typeof from === "string") {
      this.commit(from, {
        fillColor: transparent,
        strokeColor: transparent,
        time: finalTheme.defaultCommitTheme.time * 0.25
      });
    }
    const current = this.resolveCommitish(from);
    this.addBranch(
      branchName,
      row === undefined
        ? Math.max(
            ...Array.from(this.currentRefs.values()).map(v => v.ref.row)
          ) + 1
        : row,
      finalTheme,
      current
    );
    if (finalTheme.includeBranchEnd) {
      this.commit(branchName, {
        fillColor: transparent,
        strokeColor: transparent,
        time: finalTheme.defaultCommitTheme.time * 0.25
      });
    }
    return this;
  }

  private updateRef(branchName: string, commit: Commit) {
    const ref = this.currentRefs.get(branchName);
    if (!ref) {
      throw new Error(`Ref ${branchName} does not exist.`);
    }
    this.currentRefs.set(branchName, {
      ref: ref.ref,
      current: commit
    });
  }

  deleteRef(branchName: string) {
    this.currentRefs.delete(branchName);
    return this;
  }

  commit(
    branchName: string,
    theme?: Partial<CommitTheme>,
    hash?: string,
    commitCallback?: (commit: Commit) => void
  ) {
    const ref = this.currentRefs.get(branchName);
    if (!ref) {
      throw new Error(`Ref ${branchName} does not exist.`);
    }

    const finalTheme = Object.assign(
      {},
      ref.ref.theme.defaultCommitTheme,
      theme || {}
    );
    const commit = this.addCommit(
      [{ commit: ref.current, branch: ref.ref.theme, branchName }],
      ref.ref.row,
      finalTheme,
      hash
    );
    this.updateRef(branchName, commit);
    if (commitCallback) {
      commitCallback(commit);
    }
    return this;
  }

  microcommit(
    branchName: string,
    theme?: Partial<CommitTheme>,
    count: number = 2
  ) {
    const ref = this.currentRefs.get(branchName);
    if (!ref) {
      throw new Error(`Ref ${branchName} does not exist.`);
    }

    const { strokeWidth, defaultCommitTheme: { commitSize } } = ref.ref.theme;

    for (let i = 0; i < count; i++) {
      this.commit(branchName, {
        ...theme || {},
        commitSize: strokeWidth + (commitSize - strokeWidth) / 3,
        time: 1 / 3
      });
      if (theme) {
        theme.label = "";
      }
    }

    return this;
  }

  private addCommit(
    parents: CommitParent[],
    row: number,
    theme: CommitTheme,
    hash?: string
  ): Commit {
    const commit: Commit = {
      parents,
      theme,
      createTime: (this.currentTime += theme.time * 0.5),
      row
    };
    this.currentTime += theme.time * 0.5;
    this.allCommits.add(commit);
    return commit;
  }

  merge(
    branchName: string,
    otherBranch: Commitish,
    theme?: Partial<CommitTheme>,
    hash?: string
  ) {
    const ref = this.currentRefs.get(branchName);
    if (!ref) {
      throw new Error(`Ref ${branchName} does not exist.`);
    }
    const finalTheme = Object.assign(
      {},
      ref.ref.theme.defaultCommitTheme,
      theme || {}
    );
    finalTheme.time *= 0.25;
    if (typeof otherBranch === "string") {
      let otherRef = this.currentRefs.get(otherBranch);
      if (!otherRef) {
        throw new Error(`Ref ${otherBranch} does not exist.`);
      }

      if (otherRef.ref.theme.includeBranchStart) {
        this.commit(otherBranch, {
          time: 0.25,
          fillColor: transparent,
          strokeColor: transparent
        });
        otherRef = this.currentRefs.get(otherBranch)!;
      }
      const commit = this.addCommit(
        [
          { commit: ref.current, branch: ref.ref.theme, branchName },
          {
            commit: otherRef.current,
            branch: otherRef.ref.theme,
            branchName: otherBranch
          }
        ],
        ref.ref.row,
        finalTheme,
        hash
      );
      this.updateRef(branchName, commit);
    } else {
      const commit = this.addCommit(
        [
          { commit: ref.current, branch: ref.ref.theme, branchName },
          {
            commit: otherBranch,
            branch: otherBranch.parents[0].branch,
            branchName: undefined
          }
        ],
        ref.ref.row,
        finalTheme,
        hash
      );
      this.updateRef(branchName, commit);
    }
    return this;
  }

  tag(target: Commitish, tagName: string) {
    this.tags.set(tagName, this.resolveCommitish(target));
    return this;
  }

  render() {
    const commits = Array.from(this.allCommits.values());
    const parents = flatmap(commits, commit =>
      commit.parents.map(parent => ({ ...parent, child: commit }))
    );
    const tailingRefs = Array.from(this.currentRefs.values()).filter(
      ref => ref.current
    );
    const tags = Array.from(this.tags.entries());
    const maxTime = this.currentTime + 1;

    const isHorizontal = this.chartTheme.direction === "horizontal";
    const rowToDistance = ({ row }: { time: number; row: number }) =>
      row * this.chartTheme.rowDistance;
    const timeToDistance = ({ time }: { time: number; row: number }) =>
      time * this.chartTheme.timeDistance;
    const x = isHorizontal ? timeToDistance : rowToDistance;
    const y = !isHorizontal ? timeToDistance : rowToDistance;
    const commitToTimeDistance = (commit: Commit) => ({
      time: commit.createTime,
      row: commit.row + 0.5
    });
    const parentToTimeDistance = (parent: CommitParent & { child: Commit }) =>
      parent.commit
        ? commitToTimeDistance(parent.commit)
        : {
            time: 0,
            row: parent.child.row + 0.5
          };

    const base = this.element
      .append<SVGGElement>("g")
      .attr(
        "transform",
        `translate(${this.chartTheme.padding.x} ${this.chartTheme.padding.y})`
      );

    bind({
      target: base
        .append<SVGGElement>("g")
        .selectAll<SVGLineElement, {}>("line")
        .data(parents),
      onCreate: entering => entering.append<SVGLineElement>("line"),
      onEach: line =>
        line
          .attr("stroke-linecap", "round")
          .attr("stroke", parent => parent.branch.strokeColor.toString())
          .attr("stroke-width", parent => parent.branch.strokeWidth)
          .attr("x1", parent => x(commitToTimeDistance(parent.child)))
          .attr("y1", parent => y(commitToTimeDistance(parent.child)))
          .attr("x2", parent => x(parentToTimeDistance(parent)))
          .attr("y2", parent => y(parentToTimeDistance(parent)))
    });

    bind({
      target: base
        .append<SVGGElement>("g")
        .selectAll<SVGTextElement, {}>("text")
        .data(
          parents.filter(
            parent =>
              parent.branchName &&
              (parent.commit == null ||
                !parent.commit.parents.filter(
                  grandparent => grandparent.branchName == parent.branchName
                ).length)
          )
        ),
      onCreate: entering => entering.append<SVGTextElement>("text"),
      onEach: line =>
        line
          .attr("fill", parent => parent.branch.textColor.toString())
          .text(parent => parent.branchName!)
          .attr("font-size", parent => parent.branch.fontSize)
          .attr("font-family", parent => parent.branch.font)
          .attr(
            "x",
            parent =>
              x(parentToTimeDistance(parent)) + parent.branch.textOffset.x
          )
          .attr("y", parent => {
            const origin = parentToTimeDistance(parent);
            const dest = commitToTimeDistance(parent.child);
            const atan = Math.atan2(y(dest) - y(origin), x(dest) - x(origin));
            const flip = this.chartTheme.direction === "horizontal" && atan > 0;
            return (
              y(parentToTimeDistance(parent)) +
              parent.branch.textOffset.y * (flip ? -1 : 1)
            );
          })
          .attr("transform", parent => {
            const origin = parentToTimeDistance(parent);
            const dest = commitToTimeDistance(parent.child);
            const atan = Math.atan2(y(dest) - y(origin), x(dest) - x(origin));
            const actualAtan = atan > Math.PI / 2 ? Math.PI + atan : atan;

            return `rotate(${rad2deg(actualAtan)} ${x(origin)} ${y(origin)})`;
          })
          .attr("text-anchor", parent => {
            const origin = parentToTimeDistance(parent);
            const dest = commitToTimeDistance(parent.child);
            const atan = Math.atan2(y(dest) - y(origin), x(dest) - x(origin));
            const flip = atan > Math.PI / 2;
            return flip ? "end" : "start";
          })
          .attr("alignment-baseline", parent => {
            const origin = parentToTimeDistance(parent);
            const dest = commitToTimeDistance(parent.child);
            const atan = Math.atan2(y(dest) - y(origin), x(dest) - x(origin));
            const flip = this.chartTheme.direction === "horizontal" && atan > 0;
            return this.chartTheme.direction === "horizontal" && flip
              ? "hanging"
              : "ideographic";
          })
    });

    bind({
      target: base
        .append<SVGGElement>("g")
        .selectAll<SVGLineElement, {}>("line")
        .data(tailingRefs),
      onCreate: entering => entering.append<SVGLineElement>("line"),
      onEach: line =>
        line
          .attr("stroke", parent => parent.ref.theme.strokeColor.toString())
          .attr("stroke-width", parent => parent.ref.theme.strokeWidth)
          .attr("x1", parent => x(commitToTimeDistance(parent.current!)))
          .attr("y1", parent => y(commitToTimeDistance(parent.current!)))
          .attr("x2", parent =>
            x({
              row: commitToTimeDistance(parent.current!).row,
              time: maxTime
            })
          )
          .attr("y2", parent =>
            y({
              row: commitToTimeDistance(parent.current!).row,
              time: maxTime
            })
          )
    });

    bind({
      target: base
        .append<SVGGElement>("g")
        .selectAll<SVGGElement, {}>("g")
        .data(commits),
      onCreate: entering => entering.append<SVGGElement>("g"),
      onEnter: entering =>
        entering.each(function(commit) {
          commit.theme.specialStyle && commit.theme.specialStyle.onEnter
            ? commit.theme.specialStyle.onEnter(
                select<SVGGElement, Commit>(this)
              )
            : select(this).append("circle");
        }),
      onEach: g =>
        g
          .attr("transform", commit => {
            const loc = commitToTimeDistance(commit);
            return `translate(${x(loc)} ${y(loc)})`;
          })
          .each(function(commit) {
            commit.theme.specialStyle
              ? commit.theme.specialStyle.onEach(
                  select<SVGGElement, Commit>(this)
                )
              : select<SVGGElement, Commit>(this)
                  .select<SVGCircleElement>("circle")
                  .attr("fill", commit => commit.theme.fillColor.toString())
                  .attr("stroke", commit => commit.theme.strokeColor.toString())
                  .attr("stroke-width", commit => commit.theme.strokeWidth)
                  .attr("r", commit => commit.theme.commitSize / 2);
          }),
      onExit: g =>
        g.each(function(commit) {
          commit.theme.specialStyle && commit.theme.specialStyle.onExit
            ? commit.theme.specialStyle.onExit(
                select<SVGGElement, Commit>(this)
              )
            : null;
        })
    });

    bind({
      target: base
        .append<SVGGElement>("g")
        .selectAll("text")
        .data(commits.filter(commit => commit.theme.label)),
      onCreate: entering => entering.append<SVGCircleElement>("text"),
      onEach: text =>
        text
          .attr("alignment-baseline", "ideographic")
          .attr("fill", commit => commit.theme.textColor.toString())
          .text(commit => commit.theme.label!)
          .attr("font-size", commit => commit.theme.fontSize)
          .attr("font-family", commit => commit.theme.font)
          .attr(
            "x",
            commit =>
              x(commitToTimeDistance(commit)) + commit.theme.textOffset.x
          )
          .attr(
            "y",
            commit =>
              y(commitToTimeDistance(commit)) + commit.theme.textOffset.y
          )
    });

    bind({
      target: base.append<SVGGElement>("g").selectAll("g").data(tags),
      onCreate: entering => {
        const result = entering.append<SVGGElement>("g");
        result.append<SVGLineElement>("line");
        result.append<SVGTextElement>("text");
        return result;
      },
      onEach: g => {
        g
          .select<SVGTextElement>("text")
          .attr("alignment-baseline", "hanging")
          .attr("fill", ([tag, commit]) => commit.theme.textColor.toString())
          // .attr("stroke", commit => "rgba(255, 255, 255, 0.5)")
          // .attr("stroke-width", commit => 0.5)
          .text(([tag, commit]) => tag)
          .attr("font-size", ([tag, commit]) => commit.theme.fontSize)
          .attr("font-family", ([tag, commit]) => commit.theme.font)
          .attr("font-weight", "bold")
          .attr(
            "x",
            ([tag, commit]) =>
              x(commitToTimeDistance(commit)) + commit.theme.textOffset.x
          )
          .attr(
            "y",
            ([tag, commit]) =>
              y(commitToTimeDistance(commit)) - commit.theme.textOffset.y
          );
      }
    });

    const baseSize = base.node()!.getBoundingClientRect();

    this.element
      .attr("height", baseSize.height + this.chartTheme.padding.y * 2)
      .attr("width", baseSize.width + this.chartTheme.padding.x * 2);
  }
}
