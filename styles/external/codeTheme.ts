import { editor } from 'monaco-editor';

export const codeTheme: editor.IStandaloneThemeData = {
  base: 'hc-black',
  inherit: true,
  rules: [
    {
      background: '#282a3625',
      token: '',
    },
    {
      foreground: '#b2b8c9',
      token: 'comment',
    },
    {
      foreground: '#cab3ff',
      token: 'string',
    },
    {
      foreground: '#bd93f9',
      token: 'constant.numeric',
    },
    {
      foreground: '#bd93f9',
      token: 'constant.language',
    },
    {
      foreground: '#bd93f9',
      token: 'constant.character',
    },
    {
      foreground: '#bd93f9',
      token: 'constant.other',
    },
    {
      foreground: '#87bbff',
      token: 'variable.other.readwrite.instance',
    },
    {
      foreground: '#ff79c6',
      token: 'constant.character.escaped',
    },
    {
      foreground: '#ff79c6',
      token: 'constant.character.escape',
    },
    {
      foreground: '#ff79c6',
      token: 'string source',
    },
    {
      foreground: '#ff79c6',
      token: 'string source.ruby',
    },
    {
      foreground: '#ff79c6',
      token: 'keyword',
    },
    {
      foreground: '#ff79c6',
      token: 'storage',
    },
    {
      foreground: '#8be9fd',
      fontStyle: 'italic',
      token: 'storage.type',
    },
    {
      foreground: '#50fa7b',
      fontStyle: 'underline',
      token: 'entity.name.class',
    },
    {
      foreground: '#50fa7b',
      fontStyle: 'italic underline',
      token: 'entity.other.inherited-class',
    },
    {
      foreground: '#50fa7b',
      token: 'entity.name.function',
    },
    {
      foreground: '#98e4fc',
      fontStyle: 'italic',
      token: 'variable.parameter',
    },
    {
      foreground: '#ff79c6',
      token: 'entity.name.tag',
    },
    {
      foreground: '#50fa7b',
      token: 'entity.other.attribute-name',
    },
    {
      foreground: '#8be9fd',
      token: 'support.function',
    },
    {
      foreground: '#6be5fd',
      token: 'support.constant',
    },
    {
      foreground: '#66d9ef',
      fontStyle: ' italic',
      token: 'support.type',
    },
    {
      foreground: '#66d9ef',
      fontStyle: ' italic',
      token: 'support.class',
    },
    {
      foreground: '#f8f8f0',
      background: 'ff79c6',
      token: 'invalid',
    },
    {
      foreground: '#f8f8f0',
      background: 'bd93f9',
      token: 'invalid.deprecated',
    },
    {
      foreground: '#cfcfc2',
      token: 'meta.structure.dictionary.json string.quoted.double.json',
    },
    {
      foreground: '#6272a4',
      token: 'meta.diff',
    },
    {
      foreground: '#6272a4',
      token: 'meta.diff.header',
    },
    {
      foreground: '#ff79c6',
      token: 'markup.deleted',
    },
    {
      foreground: '#50fa7b',
      token: 'markup.inserted',
    },
    {
      foreground: '#b3e3ff',
      token: 'markup.changed',
    },
    {
      foreground: '#bd93f9',
      token: 'constant.numeric.line-number.find-in-files - match',
    },
    {
      foreground: '#ffffff44',
      token: 'entity.name.filename',
    },
    {
      foreground: '#f8333363',
      token: 'message.error',
    },
    {
      foreground: '#eeeeee',
      token:
        'punctuation.definition.string.begin.json - meta.structure.dictionary.value.json',
    },
    {
      foreground: '#eeeeee',
      token:
        'punctuation.definition.string.end.json - meta.structure.dictionary.value.json',
    },
    {
      foreground: '#8be9fd',
      token: 'meta.structure.dictionary.json string.quoted.double.json',
    },
    {
      foreground: '#f68cfa73',
      token: 'meta.structure.dictionary.value.json string.quoted.double.json',
    },
    {
      foreground: '#50fa7b',
      token:
        'meta meta meta meta meta meta meta.structure.dictionary.value string',
    },
    {
      foreground: '#b9f1ff',
      token: 'meta meta meta meta meta meta.structure.dictionary.value string',
    },
    {
      foreground: '#ff79c6',
      token: 'meta meta meta meta meta.structure.dictionary.value string',
    },
    {
      foreground: '#bd93f9',
      token: 'meta meta meta meta.structure.dictionary.value string',
    },
    {
      foreground: '#50fa7b',
      token: 'meta meta meta.structure.dictionary.value string',
    },
    {
      foreground: '#d0adff',
      token: 'meta meta.structure.dictionary.value string',
    },
    {
      foreground: '#b83126',
      token: 'keyword.operator.comparison',
    },
    {
      foreground: '#456e48',
      background: '#d9eab8',
      token: 'comment.line.todo.php',
    },
    {
      foreground: '#104e8b',
      token: 'support',
    },
  ],
  colors: {
    'editor.foreground': '#ffffff',
    'editor.background': '#00000030',
    'editor.selectionBackground': '#ffffff8f',
    'editor.lineHighlightBackground': '#0000000e',
    'editorCursor.foreground': '#ffffff59',
    'editorWhitespace.foreground': '#ffffff50',
    'editorIndentGuide.background': '#8F8F8F',
    'editorIndentGuide.activeBackground': '#FA2828',
  },
};
