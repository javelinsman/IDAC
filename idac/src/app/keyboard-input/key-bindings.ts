export type KeyBinding = Set<string>;

export interface KeyBindings {
  [key: string]: KeyBinding;
}

export const keyBindings: KeyBindings = {
    moveToNextElement: new Set(['tab']),
    moveToPreviousElement: new Set(['shift', 'tab']),
    moveToNextAnnotation: new Set(['d']),
    moveToPreviousAnnotation: new Set(['shift', 'd']),
    moveToNextSibling: new Set(['arrowdown']),
    moveToPreviousSibling: new Set(['arrowup']),
    moveToParent: new Set(['arrowleft']),
    moveToChild: new Set(['arrowright']),
    moveToPreviouslyVisitedElement: new Set(['u']),
    moveToNextFrame: new Set(['f']),
    moveToPreviousFrame: new Set(['shift', 'f']),
    moveToTitle: new Set(['t']),
    moveToXAxis: new Set(['x']),
    moveToYAxis: new Set(['y']),
    moveToLegend: new Set(['l']),
    moveToMarks: new Set(['m']),
    moveToAnnotations: new Set(['a']),
    moveToNextDataPoint: new Set(['p']),
    moveToPreviousDataPoint: new Set(['shift', 'p']),
    checkCurrentElement: new Set(['enter']),
    // queryMaximum: new Set(['q', 'h']),
    // queryMinimum: new Set(['q', 'j']),
    // queryAverage: new Set(['q', 'k']),
    // queryTendency: new Set(['q', 'l']),
};
