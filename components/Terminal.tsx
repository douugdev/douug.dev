import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Text3D } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import Draggable from 'react-draggable';
import {
  CURRENT_DIRECTORY,
  Directory,
  hardDrive,
  PREVIOUS_DIRECTORY,
} from 'modules/FileSystem';
import AsciiRenderer from 'components/AsciiRenderer';
import styles from 'styles/Terminal.module.scss';

// Initialize the file system with some directories and files
try {
  hardDrive.createNestedDirectories({
    home: {
      douugdev: {
        projects: {},
      },
    },
    etc: null,
    lib: {
      python3: null,
    },
    tmp: null,
    usr: null,
  });
  const homeDir = hardDrive.findDirectory('home')!.findDirectory('douugdev')!;

  homeDir
    .findDirectory('projects')
    ?.createFile('thisWebsite.txt', 'This website is a work in progress');
  homeDir.createFile(
    'welcome.txt',
    `
      Welcome!
      Bla bla
    `
  );
} catch {}

const RotatingText: React.FC = () => {
  const textRef = useRef<Mesh>(null!);

  useFrame(({ clock }) => {
    textRef.current.geometry.center();
    textRef.current.rotation.z = clock.getElapsedTime() * 1;
    textRef.current.rotation.x = clock.getElapsedTime() * 1;
  });

  return (
    <Text3D
      ref={textRef}
      bevelSegments={1}
      position={[0, 0, 0]}
      font={'/rubik.typeface.json'}
    >
      DOUUG
      <meshPhongMaterial color={'green'} />
    </Text3D>
  );
};

const Terminal = () => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [currentDirectory, setCurrentDirectory] = useState<Directory>(
    hardDrive.findDirectory('home')?.findDirectory('douugdev') ?? hardDrive
  );
  const [commandInput, setCommandInput] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([
    'Welcome! I\'m Douglas "douugdev" Silva, a front-end developer.',
    'This is an interactive terminal you can use to explore my work!',
    '\n',
    'Start by typing `ls` to list all folders.',
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
          tempDirectory = hardDrive;
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
            throw Error('The target is not a directory.');
          } else if (directory === undefined) {
            // Path doesn't exist
            throw Error('The system cannot find the path specified.');
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

  const ls = useCallback(() => {
    return [
      '.',
      '..',
      ...currentDirectory.contents.map((fileOrDir) => fileOrDir.name),
    ];
  }, [currentDirectory]);

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  const cat = useCallback((pathToFile: string) => {
    try {
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

      log('info', contents.split('\n'));
    } catch (e: any) {
      console.error(e);
      if (e instanceof Error) {
        log('error', e.message);
      }
    }
  }, []);

  const help = useCallback(() => {
    return [
      'The following commands are available',
      ...Object.keys(mapCommandToFunction),
    ];
  }, []);

  const pwd = useCallback(() => currentDirectory.path, []);
  const echo = useCallback((...args: string[]) => [args.join(' ')], []);

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
  }, [commandInput, currentDirectory]);

  const log = (
    type: 'info' | 'error',
    message: string | string[] | string[][]
  ) => {
    const commandString = `${currentDirectory.path} $ ` + commandInput;

    setLogs((prev) =>
      [
        ...prev,
        commandString,
        type === 'info' ? message : `Error: ${message}`,
      ].flat(3)
    );
  };

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
    }),
    [cd, mkdir, ls, help, pwd, echo, clear, cat]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView();
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

  return (
    <Draggable handle="#handle">
      <div className={styles.window}>
        <div id="handle" className={styles.handle}>
          <div className={styles.windowButtonClose}></div>
          <div className={styles.windowButtonMinimize}></div>
          <div className={styles.windowButtonMaximize}></div>
        </div>

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
        >
          {loadingProgress >= 100 ? (
            <div className={styles.terminalContainer}>
              <div className={styles.logsContainer}>
                {logs.map((log, index) => (
                  <span className={styles.logs} key={`log_${index}`}>
                    {log}
                  </span>
                ))}
                <div />
                <div ref={endRef}>
                  <label htmlFor="input">{currentDirectory.path} $ </label>
                  <span> {commandInput + caret}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.canvasContainer}>
              <div
                id="loading-container"
                style={{ flex: 1, position: 'relative' }}
              >
                <Suspense fallback={<h1>Booting...</h1>}>
                  <Canvas
                    className={styles.canvas}
                    gl={{ antialias: false }}
                    dpr={0.2}
                  >
                    <RotatingText />
                    <AsciiRenderer invert resolution={0.25} />
                    <directionalLight />
                  </Canvas>
                </Suspense>
              </div>
              <h2>
                {'▒'.repeat(Math.floor(loadingProgress / 2))}
                {'░'.repeat(100 / 2 - Math.floor(loadingProgress / 2))}
              </h2>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Terminal;
