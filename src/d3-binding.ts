import { Selection, BaseType, EnterElement } from "d3-selection";

export interface IBindProps<
  GElement extends BaseType,
  NewDatum,
  PElement extends BaseType,
  PDatum
> {
  /**
   * How to handle new data. This already includes initial `.append`s.
   */
  onEnter?: (target: Selection<GElement, NewDatum, PElement, PDatum>) => void;

  /**
   * Optional. How to handle data being removed. By default, it calls `.remove()`.
   */
  onExit?: (target: Selection<GElement, NewDatum, PElement, PDatum>) => void;

  /**
   * Updates elements to handle the new data.
   */
  onEach: (target: Selection<GElement, NewDatum, PElement, PDatum>) => void;
}

export interface ICompleteBindProps<
  GElement extends BaseType,
  NewDatum,
  PElement extends BaseType,
  PDatum
> extends IBindProps<GElement, NewDatum, PElement, PDatum> {
  target: Selection<GElement, NewDatum, PElement, PDatum>;

  /**
   * This should include `.append` and any initial setup.
   */
  onCreate: (
    target: Selection<EnterElement, NewDatum, PElement, PDatum>
  ) => Selection<GElement, NewDatum, PElement, PDatum>;
}

/** A convenience method that handles creating/removing/updating elements as
 *  data changes
 */
export const bind = <
  GElement extends BaseType,
  NewDatum,
  PElement extends BaseType,
  PDatum
>({
  target,
  onCreate,
  onEnter,
  onExit = target => target.remove(),
  onEach
}: ICompleteBindProps<GElement, NewDatum, PElement, PDatum>) => {
  console.log(target);
  const newElems = onCreate(target.enter());
  if (onEnter) {
    onEnter(newElems);
  }
  onExit(target.exit<NewDatum>());
  onEach(newElems.merge(target));
};
