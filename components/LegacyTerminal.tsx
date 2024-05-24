import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  CURRENT_DIRECTORY,
  Directory,
  File,
  hardDrive,
  PREVIOUS_DIRECTORY,
} from 'modules/FileSystem';
import styles from 'styles/Terminal.module.scss';
import { launchApp } from 'stores/OS';

const LegacyTerminal = () => {
  const [loadingProgress, setLoadingProgress] = useState<number>(
    process.env.NODE_ENV === 'production' ? 0 : 100
  );
  const [currentDirectory, setCurrentDirectory] = useState<Directory>(
    hardDrive.get()
  );
  const [commandInput, setCommandInput] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([
    'Welcome! I\'m Douglas "douugdev" Silva, a front-end developer.',
    'This is an interactive terminal you can use to explore my work!',
    '\n',
    'Theres a text file inside this folder, use `cat readme.txt` to read it.',
    '\n',
  ]);
  const [caret, setCaret] = useState<string>('█');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCaret((prev) => (prev === '' ? '█' : ''));
    }, 800);
    () => clearInterval(interval);
  }, []);

  const cd = useCallback(
    (path: string) => {
      const parsedPath = path.replace(/\/$/, '').replace(/\n/g, '').split('/');

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

      let tempDirectory: Directory = currentDirectory;

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
            throw Error('Target is not a directory.');
          } else if (directory === undefined) {
            // Path doesn't exist
            throw Error('No such file or directory.');
          }
          tempDirectory = directory;
        }
      }

      setCurrentDirectory(tempDirectory);
    },
    [currentDirectory, setCurrentDirectory]
  );

  const mkdir = useCallback(
    (name: string) => {
      currentDirectory.createDirectory(name);
    },
    [currentDirectory]
  );

  const ls = useCallback(
    (...args: string[]) => {
      let func = (fileOrDir: Directory | File) => fileOrDir.name;

      if (args[0]?.includes('l')) {
        func = (fileOrDir: Directory | File) => {
          if (fileOrDir.type === 'file') {
            const file = fileOrDir as File;
            return `file ${file.permissions} - ${fileOrDir.name}`;
          }

          return `directory - ${fileOrDir.name}`;
        };
      }

      return ['.', '..', ...currentDirectory.contents.map(func)];
    },
    [currentDirectory]
  );

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  const cat = useCallback(
    (pathToFile: string) => {
      if (pathToFile.includes('/')) {
        throw Error(
          'Sorry, absolute and relative paths are not yet implemented.'
        );
      }

      const file = currentDirectory.findFile(pathToFile);

      if (file === undefined) {
        throw Error('The system cannot find the path specified.');
      }

      const contents = file.read();

      return contents.split('\n');
    },
    [currentDirectory]
  );

  const help = useCallback(() => {
    return [
      'The following commands are available',
      ...Object.keys(mapCommandToFunction),
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pwd = useCallback(() => currentDirectory.path, [currentDirectory.path]);
  const echo = useCallback((...args: string[]) => [args.join(' ')], []);
  const open = useCallback((...args: string[]) => {
    switch (args[0]) {
      case 'browser':
        launchApp('browser');
        return [];
      case 'synth':
        launchApp('browser', { initialURL: 'https://synth.douug.dev' });
        return [];
      case 'code':
        launchApp('code');
        return [];
    }

    return [`"${args[0]}": No such app or command`];
  }, []);
  const code = useCallback(
    (...args: string[]) => {
      return open('code');
    },
    [open]
  );

  const log = useCallback(
    (type: 'info' | 'error', message: string | string[] | string[][]) => {
      const commandString = `${currentDirectory.path} $ ` + commandInput;
      console.log(
        [
          ...logs,
          commandString,
          type === 'info' ? message : `Error: ${message}`,
        ].flat(3)
      );
      setLogs((prev) =>
        [
          ...prev,
          commandString,
          type === 'info' ? message : `Error: ${message}`,
        ].flat(3)
      );
    },
    [commandInput, currentDirectory.path, logs]
  );

  const mapCommandToFunction = useMemo(
    () => ({
      cd,
      mkdir,
      ls,
      help,
      pwd,
      echo,
      clear,
      cat,
      open,
      code,
    }),
    [cd, mkdir, ls, help, pwd, echo, clear, cat, open, code]
  );

  const runCommand = useCallback(() => {
    if (commandInput.length === 0) {
      return;
    }

    // TODO: Better command parsing
    const args = commandInput.split(' ');
    const command = args[0];
    const commandArgs = args.slice(1);
    try {
      if (!(command in mapCommandToFunction)) {
        throw Error(
          `${command} is not a valid command, try typing help for a list of available commands!`
        );
      }
      const func =
        mapCommandToFunction[command as keyof typeof mapCommandToFunction];
      const returnValue = func.apply(this, commandArgs) as any;
      log('info', returnValue);
    } catch (e: any) {
      console.error(e);
      if (e instanceof Error) {
        log('error', e.message);
      }
    }
  }, [commandInput, log, mapCommandToFunction]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollTo({ top: Number.MAX_SAFE_INTEGER });
    }
  }, [commandInput]);

  useEffect(() => {
    if (loadingProgress === 100) {
      return;
    }
    const timeout = setTimeout(() => {
      setLoadingProgress((prev) =>
        Math.min(100, prev + Math.max(0, Math.random() * 2))
      );
    }, 50);
    return () => clearTimeout(timeout);
  }, [loadingProgress]);

  useEffect(() => {
    startTransition(() => {
      const homeDir = hardDrive
        .get()
        .findDirectory('home')!
        .findDirectory('douugdev')!;
      setCurrentDirectory(homeDir);
    });
  }, []);

  return (
    <div className={styles.fill}>
      <input
        ref={inputRef}
        autoComplete="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoFocus={true}
        name="input"
        type="text"
        className={styles.hiddenInput}
        value={commandInput}
        onChange={(e) => setCommandInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            runCommand();
            setCommandInput('');
          }
        }}
      />
      <div
        className={styles.terminal}
        onClick={() => inputRef.current?.focus()}
        ref={endRef}
      >
        <div className={styles.terminalContainer}>
          <div className={styles.logsContainer}>
            {logs.map((log, index) => (
              <span className={styles.logs} key={`log_${index}`}>
                {log}
              </span>
            ))}
            <div />
            <div>
              <label htmlFor="input">{currentDirectory.path} $ </label>
              <span> {commandInput + caret}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegacyTerminal;
