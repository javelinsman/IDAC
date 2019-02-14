import { firstLetterUpperCase } from '../utils';

export interface KeyBinding {
  key: Set<string>;
  description: string;
  keyName: string;
  keyNameShort: string;
}

export interface KeyBindings {
  [key: string]: KeyBinding;
}

export const keyBindings: KeyBindings = {
    checkCurrentElement: {
      key: new Set(['enter']),
      description: 'Repeat the description of the current element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToNextElement: {
      key: new Set(['tab']),
      description: `Move to the next adjacent element. (If the element has children, move to the first child.)`,
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousElement: {
      key: new Set(['shift', 'tab']),
      description: `Move to the previous adjacent element.`,
      keyName: '',
      keyNameShort: ''
    },
    moveToNextSibling: {
      key: new Set(['arrowdown']),
      description: 'Move to the next sibling element. (Child elements are skipped.)',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousSibling: {
      key: new Set(['arrowup']),
      description: 'Move to the previous sibling element. (Child elements are skipped.)',
      keyName: '',
      keyNameShort: ''
    },
    moveToParent: {
      key: new Set(['arrowleft']),
      description: 'Move to the parent element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToChild: {
      key: new Set(['arrowright']),
      description: 'Move to the last visited child element (if any), or move to the first one.',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviouslyVisitedElement: {
      key: new Set(['u']),
      description: `Jump to the previously visited element (similar to 'undo').`,
      keyName: '',
      keyNameShort: ''
    },
    moveToNextDataPoint: {
      key: new Set(['p']),
      description: 'Jump to the next data point (a unit bar or point).',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousDataPoint: {
      key: new Set(['shift', 'p']),
      description: 'Jump to the previous data point (a unit bar or point).',
      keyName: '',
      keyNameShort: ''
    },
    moveToNextAnnotation: {
      key: new Set(['d']),
      description: 'Jump to the next annotation element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousAnnotation: {
      key: new Set(['shift', 'd']),
      description: 'Jump to the previous annotation element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToNextFrame: {
      key: new Set(['f']),
      description: 'Jump to the next frame, which is the next sibling of its root element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousFrame: {
      key: new Set(['shift', 'f']),
      description: 'Jump to the previous frame, which is the previous sibling of its root element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToTitle: {
      key: new Set(['t']),
      description: 'Jump to <Title> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToXAxis: {
      key: new Set(['x']),
      description: 'Jump to <X Axis> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToYAxis: {
      key: new Set(['y']),
      description: 'Jump to <Y Axis> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToLegend: {
      key: new Set(['l']),
      description: 'Jump to <Legend> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToMarks: {
      key: new Set(['m']),
      description: 'Jump to <Marks> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToAnnotations: {
      key: new Set(['a']),
      description: 'Jump to <Annotations> tag.',
      keyName: '',
      keyNameShort: ''
    },
    // queryMaximum: new Set(['q', 'h']),
    // queryMinimum: new Set(['q', 'j']),
    // queryAverage: new Set(['q', 'k']),
    // queryTendency: new Set(['q', 'l']),
};

Object.values(keyBindings).forEach(keyBinding => {
  const keys = Array.from(keyBinding.key).map(key =>
    firstLetterUpperCase(key.replace('arrow', '')));
  keyBinding.keyName = keys.join('+');
  keyBinding.keyNameShort = shorten(keyBinding.keyName);
});

function shorten(keyName: string) {
  switch (keyName) {
    case 'Down':
      return '↓';
    case 'Up':
      return '↑';
    case 'Left':
      return '←';
    case 'Right':
      return '→';
    default:
      return keyName.replace('Shift+', '⇧ ');
  }
}
