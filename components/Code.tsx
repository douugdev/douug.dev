import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import { hardDrive, File, Directory } from 'modules/FileSystem';
import { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import styles from 'styles/Code.module.scss';
import { codeTheme } from 'styles/codeTheme';

const Code = () => {
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

  useEffect(() => {
    const currentDirectory = hardDrive
      .findDirectory('home')!
      .findDirectory('douugdev')!
      .findDirectory('projects');

    setCurrentDir(currentDirectory);
    setCurrentFile(currentDirectory!.findFile('code.js')!);
  }, []);
  console.log(currentFile?.name.includes('.js') ? 'javascript' : 'text');

  return (
    <div className={styles.windowContainer}>
      <div className={styles.fileExplorer}>
        <span className={styles.path}>/home/douugdev/projects</span>
        {/* <span className={styles.path}></span> */}
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
      <div className={styles.codeContainer}>
        <Editor
          height="100%"
          width="100%"
          options={{
            fontFamily: 'Open Sans',
            fontLigatures: true,
            fontSize: 18,
            minimap: { enabled: false },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
          // defaultLanguage="text"
          language={currentFile?.name.includes('.ts') ? 'typescript' : 'text'}
          onMount={handleEditorDidMount}
          value={currentFile?.read() ?? ''}
          onChange={(value) => {
            currentFile?.write(value ?? '');
            setCurrentFile(currentFile);
          }}
        />
        <div id="vim-status-bar" />
      </div>
    </div>
  );
};

export default Code;
