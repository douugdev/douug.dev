'use client';

import { getSafeProcessInfo, processes } from '@/stores/OS';
import Editor, { Monaco } from '@monaco-editor/react';
import { useStore } from '@nanostores/react';
import { hardDrive, File, Directory } from 'modules/FileSystem';
import { editor } from 'monaco-editor';
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from 'styles/Code.module.scss';
import { codeTheme } from 'styles/external/codeTheme';
import { ContentComponentProps } from './Window';

const Code = ({ pid }: ContentComponentProps) => {
  const fileExplorerRef = useRef<HTMLDivElement>(null!);

  const _ = useStore(processes);

  const process = getSafeProcessInfo(pid);

  const monacoRef = useRef<Monaco>(null!);

  const handleEditorDidMount = (
    _: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoRef.current = monaco;
    monaco.editor?.defineTheme('default-theme', codeTheme);
    monaco.editor.setTheme('default-theme');
  };

  const [currentDir, setCurrentDir] = useState<Directory>();
  const [currentFile, setCurrentFile] = useState<File>();

  const [prevMouseX, setPrevMouseX] = useState<number>(0);
  const [prevMouseY, setPrevMouseY] = useState<number>(0);

  const [fileExplorerWidth, setFileExplorerWidth] = useState<number>(
    process.window.size.width / 3
  );

  const [action, setAction] = useState<'resizing-file-explorer' | 'idle'>(
    'idle'
  );

  const onMouseUp: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    setAction('idle');
  }, []);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    console.log('onMouseDownCalled');
    e.preventDefault();
    setPrevMouseX(e.clientX);
    setPrevMouseY(e.clientY);
    setAction('resizing-file-explorer');
  }, []);

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      switch (action) {
        case 'resizing-file-explorer':
          e.preventDefault();

          const xMouseDiff = prevMouseX - e.clientX;
          // const yMouseDiff = prevMouseY - e.clientY;

          setPrevMouseX(e.clientX);
          // setPrevMouseY(e.clientY);

          console.log(xMouseDiff, fileExplorerWidth);
          setFileExplorerWidth((prev) => prev - xMouseDiff);
          break;
      }
    },
    [action, fileExplorerWidth, prevMouseX]
  );

  useEffect(() => {
    if (action === 'resizing-file-explorer') {
      // @ts-expect-error I'll fix the typing sometime in the future...
      document.onmouseup = onMouseUp;
      // @ts-expect-error
      document.onmousemove = onMouseMove;
    } else {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  });

  useEffect(() => {
    const currentDirectory = hardDrive
      .get()
      .findDirectory('home')!
      .findDirectory('douugdev')!
      .findDirectory('projects');

    setCurrentDir(currentDirectory);
    setCurrentFile(currentDirectory!.findFile('code.js')!);
  }, []);

  return (
    <div className={styles.windowContainer}>
      <div
        ref={fileExplorerRef}
        className={styles.fileExplorer}
        style={{
          width: fileExplorerWidth,
        }}
      >
        <span className={styles.path}>/home/douugdev/projects</span>
        {currentDir?.contents.map((fileOrDir, index) => (
          <button
            key={fileOrDir.name + index}
            className={`${styles.button} ${
              fileOrDir.name === currentFile?.name ? styles.buttonSelected : ''
            }`}
            onClick={() => {
              if (fileOrDir.type === 'file') {
                setCurrentFile(fileOrDir as File);
              }
            }}
          >
            {fileOrDir.name}
          </button>
        ))}
      </div>
      <div onMouseDown={onMouseDown} className={styles.sideHandle}>
        <div className={styles.hitbox} />
      </div>
      <div
        className={styles.codeContainer}
        style={{
          width: Math.max(process.window.size.width - fileExplorerWidth),
        }}
      >
        <Editor
          height="100%"
          width="100%"
          options={{
            fontFamily: 'Red Hat Mono',
            fontLigatures: true,
            fontSize: 18,
            minimap: { enabled: false },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
          language={
            currentFile?.name.includes('.ts')
              ? 'typescript'
              : currentFile?.name.includes('.doug')
              ? 'c'
              : 'text'
          }
          onMount={handleEditorDidMount}
          value={currentFile?.read() ?? ''}
          onChange={(value) => {
            currentFile?.write(value ?? '');
            setCurrentFile(currentFile);
          }}
        />
      </div>
    </div>
  );
};

export default Code;
