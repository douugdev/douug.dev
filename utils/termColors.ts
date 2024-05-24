export const termColors = {
  Reset: '\x1b[0m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  FgGray: '\x1b[90m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
  BgGray: '\x1b[100m',

  Bold: '\x1b[1m',
  Faint: '\x1b[2m',
  Italics: '\x1b[3m',
  Inverse: '\x1b[7m',
  Strikethrough: '\x1b[9m',
  Invisible: '\x1b[8m',
};

// TODO: add more styles other than colors
// const lines = [
//   ['Ascii ─', 'abc123'],
//   ['CJK ─', '汉语, 漢語, 日本語, 한국어'],
//   [
//     'Powerline ─',
//     '\ue0b2\ue0b0\ue0b3\ue0b1\ue0b6\ue0b4\ue0b7\ue0b5\ue0ba\ue0b8\ue0bd\ue0b9\ue0be\ue0bc',
//   ],
// ['Box drawing ┬', '┌─┬─┐ ┏━┳━┓ ╔═╦═╗ ┌─┲━┓ ╲   ╱'],
// ['            │', '│ │ │ ┃ ┃ ┃ ║ ║ ║ │ ┃ ┃  ╲ ╱'],
// ['            │', '├─┼─┤ ┣━╋━┫ ╠═╬═╣ ├─╄━┩   ╳'],
// ['            │', '│ │ │ ┃ ┃ ┃ ║ ║ ║ │ │ │  ╱ ╲'],
// ['            └', '└─┴─┘ ┗━┻━┛ ╚═╩═╝ └─┴─┘ ╱   ╲'],
//   ['Block elem ─', '░▒▓█ ▁▂▃▄▅▆▇█ ▏▎▍▌▋▊▉'],
//   ['Emoji ─', '😉 👋'],
//   [
//     '16 color ─',
//     [
//       ..._1to8.map((e) => `\x1b[3${e - 1}m●`),
//       ..._1to8.map((e) => `\x1b[1;3${e - 1}m●`),
//     ].join(''),
//   ],
//   [
//     '256 color ┬',
//     [..._0to35.map((e) => `\x1b[38;5;${16 + 36 * 0 + e}m●`)].join(''),
//   ],
//   [
//     '          │',
//     [..._0to35.map((e) => `\x1b[38;5;${16 + 36 * 1 + e}m●`)].join(''),
//   ],
//   [
//     '          │',
//     [..._0to35.map((e) => `\x1b[38;5;${16 + 36 * 2 + e}m●`)].join(''),
//   ],
//   [
//     '          │',
//     [..._0to35.map((e) => `\x1b[38;5;${16 + 36 * 3 + e}m●`)].join(''),
//   ],
//   [
//     '          │',
//     [..._0to35.map((e) => `\x1b[38;5;${16 + 36 * 4 + e}m●`)].join(''),
//   ],
//   [
//     '          │',
//     [..._0to35.map((e) => `\x1b[38;5;${16 + 36 * 5 + e}m●`)].join(''),
//   ],
//   [
//     '          └',
//     [..._1to24.map((e) => `\x1b[38;5;${232 + e - 1}m●`)].join(''),
//   ],
//   [
//     'True color ┬',
//     [..._1to64.map((e) => `\x1b[38;2;${64 * 0 + e - 1};0;0m●`)].join(
//       ''
//     ),
//   ],
//   [
//     '           │',
//     [..._1to64.map((e) => `\x1b[38;2;${64 * 1 + e - 1};0;0m●`)].join(
//       ''
//     ),
//   ],
//   [
//     '           │',
//     [..._1to64.map((e) => `\x1b[38;2;${64 * 2 + e - 1};0;0m●`)].join(
//       ''
//     ),
//   ],
//   [
//     '           └',
//     [..._1to64.map((e) => `\x1b[38;2;${64 * 3 + e - 1};0;0m●`)].join(
//       ''
//     ),
//   ],
//   [
//     'Styles ─',
//     [
//       '\x1b[1mBold',
//       '\x1b[2mFaint',
//       '\x1b[3mItalics',
//       '\x1b[7mInverse',
//       '\x1b[9mStrikethrough',
//       '\x1b[8mInvisible',
//     ].join('\x1b[0m, '),
//   ],
//   [
//     'Underlines ─',
//     [
//       '\x1b[4:1mStraight',
//       '\x1b[4:2mDouble',
//       '\x1b[4:3mCurly',
//       '\x1b[4:4mDotted',
//       '\x1b[4:5mDashed',
//     ].join('\x1b[0m, '),
//   ],
// ];
