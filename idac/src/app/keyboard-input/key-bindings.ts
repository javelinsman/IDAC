import { firstLetterUpperCase } from '../utils';

export interface KeyBinding {
  type: 'navigation' | 'query';
  key: Set<string>;
  description: string;
  keyName: string;
  keyNameShort: string;
}

export interface KeyBindings {
  [key: string]: KeyBinding;
}

export const keyBindings: KeyBindings = {
    stopSpeaking: {
      type: 'navigation',
      key: new Set(['control']),
      description: 'Stop reading current element.',
      keyName: '',
      keyNameShort: ''
    },
    checkCurrentElement: {
      type: 'navigation',
      key: new Set(['enter']),
      description: 'Repeat the description of the current element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToNextElement: {
      type: 'navigation',
      key: new Set(['tab']),
      description: `Move to the next adjacent element. (If the element has children, move to the first child.)`,
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousElement: {
      type: 'navigation',
      key: new Set(['shift', 'tab']),
      description: `Move to the previous adjacent element.`,
      keyName: '',
      keyNameShort: ''
    },
    moveToNextSibling: {
      type: 'navigation',
      key: new Set(['arrowdown']),
      description: 'Move to the next sibling element. (Child elements are skipped.)',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousSibling: {
      type: 'navigation',
      key: new Set(['arrowup']),
      description: 'Move to the previous sibling element. (Child elements are skipped.)',
      keyName: '',
      keyNameShort: ''
    },
    moveToParent: {
      type: 'navigation',
      key: new Set(['arrowleft']),
      description: 'Move to the parent element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToChild: {
      type: 'navigation',
      key: new Set(['arrowright']),
      description: 'Move to the last visited child element (if any), or move to the first one.',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviouslyVisitedElement: {
      type: 'navigation',
      key: new Set(['u']),
      description: `Jump to the previously visited element (similar to 'undo').`,
      keyName: '',
      keyNameShort: ''
    },
    moveToNextDataPoint: {
      type: 'navigation',
      key: new Set(['p']),
      description: 'Jump to the next data point (a unit bar or point).',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousDataPoint: {
      type: 'navigation',
      key: new Set(['shift', 'p']),
      description: 'Jump to the previous data point (a unit bar or point).',
      keyName: '',
      keyNameShort: ''
    },
    moveToNextAnnotation: {
      type: 'navigation',
      key: new Set(['d']),
      description: 'Jump to the next annotation element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousAnnotation: {
      type: 'navigation',
      key: new Set(['shift', 'd']),
      description: 'Jump to the previous annotation element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToNextFrame: {
      type: 'navigation',
      key: new Set(['f']),
      description: 'Jump to the next frame, which is the next sibling of its root element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToPreviousFrame: {
      type: 'navigation',
      key: new Set(['shift', 'f']),
      description: 'Jump to the previous frame, which is the previous sibling of its root element.',
      keyName: '',
      keyNameShort: ''
    },
    moveToTitle: {
      type: 'navigation',
      key: new Set(['t']),
      description: 'Jump to <Title> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToXAxis: {
      type: 'navigation',
      key: new Set(['x']),
      description: 'Jump to <X Axis> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToYAxis: {
      type: 'navigation',
      key: new Set(['y']),
      description: 'Jump to <Y Axis> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToLegend: {
      type: 'navigation',
      key: new Set(['l']),
      description: 'Jump to <Legend> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToMarks: {
      type: 'navigation',
      key: new Set(['m']),
      description: 'Jump to <Marks> tag.',
      keyName: '',
      keyNameShort: ''
    },
    moveToAnnotations: {
      type: 'navigation',
      key: new Set(['a']),
      description: 'Jump to <Annotations> tag.',
      keyName: '',
      keyNameShort: ''
    },
    readDescendants: {
      type: 'query',
      key: new Set(['shift', 'enter']),
      description: 'read the whole contents contained in this element',
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
