// TODO: This file is a complete mess, needs a rewrite ASAP

import { Terminal } from '@xterm/xterm';
import ansiEscapes, { cursorLeft, cursorMove } from 'ansi-escapes';
import { removeByIndex } from '@/utils/string';
import { spliceNoMutate } from '@/utils/array';
import {
  CURRENT_DIRECTORY,
  Directory,
  File,
  PREVIOUS_DIRECTORY,
  hardDrive,
} from './FileSystem';
import { atom } from 'nanostores';
import stripAnsi from 'strip-ansi';
import { launchApp } from '@/stores/OS';

export type WASM = {
  cwrap: (
    funcName: string,
    paramType: string,
    paramTypes: string[]
  ) => (param: string) => Promise<string>;
};

export const startingDir = () => {
  return hardDrive.get().findDirectory('home')!.findDirectory('douugdev')!;
};

export const previousCommands = atom<string[]>([]);

export const configureTerminal = (
  term: Terminal,
  {
    promptPrefix,
    welcomeText,
  }: { welcomeText: string; promptPrefix: string; styles: string }
) => {
  let historyIndex = -1;
  let previousCursorPosition = 0;
  let command = '';
  let wasm: WASM;

  let currentDir = startingDir();

  welcomeText
    .split('\n')
    .slice(1)
    .forEach((line) => {
      const { cols } = term;
      const padding = Math.max(
        Math.ceil(cols / 2 - stripAnsi(line).length / 2),
        0
      );
      return term.writeln(' '.repeat(padding) + line);
    });

  term.write(promptPrefix);

  const prompt = () => {
    command = '';
    historyIndex = -1;
    term.write('\r\n' + promptPrefix);
  };

  const formatMessage = (
    name: string,
    description: string,
    padding: number = 10
  ) => {
    const maxLength = term.cols - padding - 3;
    let remaining = description;
    const d = [];
    while (remaining.length > 0) {
      // Trim any spaces left over from the previous line
      remaining = remaining.trimStart();
      // Check if the remaining text fits
      if (remaining.length < maxLength) {
        d.push(remaining);
        remaining = '';
      } else {
        let splitIndex = -1;
        // Check if the remaining line wraps already
        if (remaining[maxLength] === ' ') {
          splitIndex = maxLength;
        } else {
          // Find the last space to use as the split index
          for (let i = maxLength - 1; i >= 0; i--) {
            if (remaining[i] === ' ') {
              splitIndex = i;
              break;
            }
          }
        }
        d.push(remaining.substring(0, splitIndex));
        remaining = remaining.substring(splitIndex);
      }
    }
    const message =
      `  \x1b[36;1m${name.padEnd(padding)}\x1b[0m ${d[0]}` +
      d.slice(1).map((e) => `\r\n  ${' '.repeat(padding)} ${e}`);
    return message;
  };

  const addTabbed = (
    name: string,
    description: string,
    tabWidth: number = 5
  ) => {
    const maxLength = term.cols - tabWidth - 3;
    let remaining = description;
    const d = [];
    while (remaining.length > 0) {
      // Trim any spaces left over from the previous line
      remaining = remaining.trimStart();
      // Check if the remaining text fits
      if (remaining.length < maxLength) {
        d.push(remaining);
        remaining = '';
      } else {
        let splitIndex = -1;
        // Check if the remaining line wraps already
        if (remaining[maxLength] === ' ') {
          splitIndex = maxLength;
        } else {
          // Find the last space to use as the split index
          for (let i = maxLength - 1; i >= 0; i--) {
            if (remaining[i] === ' ') {
              splitIndex = i;
              break;
            }
          }
        }
        d.push(remaining.substring(0, splitIndex));
        remaining = remaining.substring(splitIndex);
      }
    }
    const message =
      `${name.padEnd(tabWidth)} ${d[0]}` +
      d.slice(1).map((e) => `\r\n  ${' '.repeat(tabWidth)} ${e}`);
    return message;
  };

  const commands = {
    help: {
      f: () => {
        term.writeln(
          [
            'Welcome to coffeeOS! Here are some commands you can use:',
            '',
            ...Object.keys(commands).map((e) =>
              formatMessage(e, commands[e as keyof typeof commands].description)
            ),
          ].join('\n\r')
        );
        prompt();
      },
      description: 'Prints this help message',
    },
    ls: {
      f: (...args: string[]) => {
        let func = (fileOrDir: Directory | File) => fileOrDir.name;

        if (args[0]?.includes('l')) {
          func = (fileOrDir: Directory | File) => {
            if (fileOrDir.type === 'file') {
              // const file = fileOrDir as File;
              return addTabbed('drw-', fileOrDir.name, 5);
            }

            return addTabbed('-rw-', fileOrDir.name, 5);
          };
        }

        term.writeln(
          ['.', '..', ...currentDir.contents.map(func)].join('\n\r')
        );
        prompt();
      },
      description: 'Prints the current directory structure',
    },
    loadtest: {
      f: () => {
        let testData = [];
        let byteCount = 0;
        for (let i = 0; i < 50; i++) {
          let count = 1 + Math.floor(Math.random() * 79);
          byteCount += count + 2;
          let data = new Uint8Array(count + 2);
          data[0] = 0x0a; // \n
          for (let i = 1; i < count + 1; i++) {
            data[i] = 0x61 + Math.floor(Math.random() * (0x7a - 0x61));
          }
          // End each line with \r so the cursor remains constant, this is what ls/tree do and improves
          // performance significantly due to the cursor DOM element not needing to change
          data[data.length - 1] = 0x0d; // \r
          testData.push(data);
        }
        let start = performance.now();
        for (let i = 0; i < 1024; i++) {
          for (const d of testData) {
            term.write(d);
          }
        }
        // Wait for all data to be parsed before evaluating time
        term.write('', () => {
          let time = Math.round(performance.now() - start);
          let mbs = ((byteCount / 1024) * (1 / (time / 1000))).toFixed(2);
          term.write(
            `\n\r\nWrote ${byteCount}kB in ${time}ms (${mbs}MB/s) using the webgl renderer`
          );
          prompt();
        });
      },
      description: 'Simulate a lot of data coming from a process',
    },
    clear: {
      f: () => {
        term.write(ansiEscapes.clearTerminal + promptPrefix);
      },
      description: 'Clears the terminal',
    },
    cat: {
      f: (...args: string[]) => {
        const fileName = args[0];

        const file = currentDir.findFile(fileName);

        if (currentDir.findDirectory(fileName)) {
          term.writeln(`cat: ${fileName}: Is a directory`);
          prompt();
          return 1;
        }

        if (!file) {
          term.writeln(`cat: ${fileName}: No such file or directory`);
          prompt();
          return 1;
        }

        const lines = file.read().split('\n');

        lines.forEach((line) => term.writeln(line));
        prompt();
        return 0;
      },
      description: 'Prints the contents of a file',
    },
    cd: {
      f: (...args: string[]) => {
        const path = args[0];

        const parsedPath = path
          .replace(/\/$/, '')
          .replace(/\n/g, '')
          .split('/');

        // If path is absolute, don't ignore first slash
        if (path[0] === '/') {
          parsedPath[0] = '/';
        }

        // User input has two slashes at the end
        if (path.at(-1)?.length === 0) {
          throw Error('Invalid path specified.');
        }

        // Empty input
        if (path.length === 0) {
          return;
        }

        let tempDirectory: Directory = currentDir;
        try {
          for (const filename of parsedPath) {
            if (filename.length === 0) {
              // Path has double slashes
              throw Error('Invalid path specified.');
            } else if (filename === '/') {
              // Path is absolute
              tempDirectory = hardDrive.get();
            } else if (filename === CURRENT_DIRECTORY) {
              // Filename is '.'
              continue;
            } else if (filename === PREVIOUS_DIRECTORY) {
              // Filename is '..'
              if (tempDirectory.previousDirectory !== null) {
                tempDirectory = tempDirectory.previousDirectory;
              } else {
                // Path has already reached root
                continue;
              }
            } else {
              const directory = tempDirectory.findDirectory(filename);
              const file = tempDirectory.findFile(filename);
              if (file) {
                term.writeln('Target is not a directory.');
                prompt();
                return 1;
              } else if (directory === undefined) {
                // Path doesn't exist
                term.writeln('No such file or directory.');
                prompt();
                return 1;
              }
              tempDirectory = directory;
            }
          }

          currentDir = tempDirectory;
          prompt();
          return 0;
        } catch (e) {
          console.error(e);
          term.writeln('Segmentation fault');
          prompt();
          return 1;
        }
      },
      description: 'Changes the current directory',
    },
    curl: {
      f: (...args: string[]) => {
        const url = args[0];

        fetch(url)
          .then(async (output) => {
            const lines = (await output.text()).split('\n');

            lines.forEach((line) => term.writeln(line));
            prompt();
          })
          .catch((e) => {
            if (!e.message || 'TypeError' in e.message) {
              term.writeln('Error: probably CORS error, check console');
            }

            term.writeln('Error: unknown error');
            prompt();
          });

        return 0;
      },
      description: 'Makes an HTTP request',
    },
    open: {
      f: (...args: string[]) => {
        switch (args[0]) {
          case 'browser':
            launchApp('browser');
            return [];
          case 'synth':
            launchApp('browser', { initialURL: 'https://synth.douug.dev' });
            return [];
          case 'technopanther':
            launchApp('browser', {
              initialURL: 'https://technopanther.douug.dev',
            });
            return [];
          case 'code':
            launchApp('code');
            return [];
        }

        return [`"${args[0]}": No such app or command`];
      },
      description: 'Opens an application',
    },
    code: {
      f: (...args: string[]) => {
        return open('code');
      },
      description: 'Opens a file in coffeeIDE ',
    },
  };

  const runCommand = (term: Terminal, text: string) => {
    const [command, ...args] = text.trim().split(' ');
    if (command.length > 0) {
      term.writeln('');
      previousCommands.set([text, ...previousCommands.get()]);
      if (command in commands) {
        commands[command as keyof typeof commands].f(...args);
        return;
      }
      term.writeln(`${command}: command not found`);
    }
    prompt();
  };

  term.onData((e) => {
    let previousCommand = '';

    switch (e) {
      case '\u0003': // Ctrl+C
        term.write('^C');

        prompt();
        break;
      case '\r': // Enter
        runCommand(term, command);
        command = '';
        break;
      case '\x1b[A': // up arrow
        if (previousCommands.get()[historyIndex + 1] === undefined) {
          break;
        }

        historyIndex++;

        previousCommand = previousCommands.get()[historyIndex];

        // Do not move into the prompt
        command = previousCommand;
        term.write(
          ansiEscapes.cursorLeft +
            ansiEscapes.eraseLine +
            promptPrefix +
            previousCommand +
            cursorLeft +
            cursorMove(previousCommand.length + 2)
        );
        break;
      case '\x1b[B': // down arrow
        if (
          historyIndex - 1 < 0 ||
          previousCommands.get()[historyIndex - 1] === undefined
        ) {
          break;
        }

        historyIndex--;

        previousCommand = previousCommands.get()[historyIndex];

        // Do not move into the prompt
        command = previousCommand;
        term.write(
          ansiEscapes.cursorLeft +
            ansiEscapes.eraseLine +
            promptPrefix +
            previousCommand +
            cursorLeft +
            cursorMove(previousCommand.length + 2)
        );
        break;
      case '\x1b[D': // left arrow
        // Do not move into the prompt
        if (term.buffer.normal.cursorX <= 2) {
          break;
        }
        term.write(ansiEscapes.cursorBackward());
        break;
      case '\x1b[C': // right arrow
        // Do not move outside of the already written command
        if (term.buffer.normal.cursorX >= command.length + 2) {
          break;
        }

        term.write(ansiEscapes.cursorForward());
        break;
      case '\u007F': // Backspace (DEL)
        if (term.buffer.normal.cursorX <= 2) {
          break;
        }

        previousCursorPosition = term.buffer.normal.cursorX;

        command = removeByIndex(command, term.buffer.normal.cursorX - 3);

        term.write(
          ansiEscapes.cursorLeft +
            ansiEscapes.eraseLine +
            promptPrefix +
            command +
            ansiEscapes.cursorLeft +
            ansiEscapes.cursorMove(previousCursorPosition - 1)
        );
        break;
      default: // Print all other characters for demo
        previousCursorPosition = term.buffer.normal.cursorX;
        if (
          (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) ||
          e >= '\u00a0'
        ) {
          command = spliceNoMutate(
            command.split(''),
            term.buffer.normal.cursorX - 2,
            e
          ).join('');

          term.write(
            ansiEscapes.cursorLeft +
              ansiEscapes.eraseLine +
              promptPrefix +
              command +
              (term.buffer.normal.cursorX - 1 !== command.length
                ? ansiEscapes.cursorLeft +
                  ansiEscapes.cursorMove(previousCursorPosition + 1)
                : '')
          );
        }
    }
  });
};
