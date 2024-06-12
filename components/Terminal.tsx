'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';

import FontFaceObserver from 'fontfaceobserver';

import { Terminal as XTerminal } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { WebglAddon } from '@xterm/addon-webgl';
import { FitAddon } from '@xterm/addon-fit';

import { xtermjsTheme } from '@/styles/external/termTheme';
import styles from '@/styles/Terminal.module.scss';
import '@/styles/globals.css';
import '@/styles/external/xterm.css';

import { configureTerminal } from '@/modules/Terminal';
import { termColors } from '@/utils/termColors';
import { getProcess } from '@/stores/OS';
import { WindowProps } from './Window';

const termstyles = `
color: white;
padding: 0rem 0.5rem;
padding-top: 2rem;

width: 100%;
height: 100%;
overflow-y: auto;
overflow-x: hidden;
`;

// ┌─┬─┐
// │ │ │
// ├─┼─┤
// │ │ │
// └─┴─┘

//                 .-. .-.                          .-.
//                / -'/ -'          .--.    .-.--.-'
//   .-.  .-._. -/---/--.-.   .-.  /    )`-' (  (_)
//  (    (   )  /   / ./.-'_./.-'_/    /      `-.
//   `---'`-'`.' `.'  (__.' (__.'(    /     _    )
//                                `-.'     (_.--'

const welcomeText = `
┌─────────────────────────────────────────────────────┐
│                .-. .-.                          .-. │ 
│               / -'/ -'          .--.    .-.--.-'    │
│  .-.  .-._. -/---/--.-.   .-.  /    )\`-' (  (_)     │
│ (    (   )  /   / ./.-'_./.-'_/    /      \`-.       │
│  \`---'\`-'\`.' \`.'  (__.' (__.'(    /     _    )      │
│                               \`-.'     (_.--'       │
└─────────────────────────────────────────────────────┘
  
${termColors.Bold}Welcome!${termColors.Reset}
This is an interactive terminal simulator
you can use to explore my work.

There's a text file inside this folder.
You can use ${termColors.BgWhite + termColors.BgCyan} cat readme.txt ${
  termColors.Reset
} to read it!
`;

const promptPrefix = '$ ';

const fitAddon = new FitAddon();

const fontFamily = 'Red Hat Mono';

const Terminal: React.FC<WindowProps> = ({ pid }) => {
  const termRef = useRef<HTMLDivElement>(null!);
  const [term] = useState<XTerminal>(
    new XTerminal({
      theme: xtermjsTheme,
      fontFamily,
      allowTransparency: true,
      fontSize: 18,
    })
  );
  const [loadingFonts, setLoadingFonts] = useState<boolean>(true);
  const [loadingTerm, setLoadingTerm] = useState<boolean>(true);

  const process = useStore(getProcess(pid));

  if (!process || process.type === 'background') {
    throw 'Tried rendering a window for a background or unavailable process';
  }

  useEffect(() => {
    term.loadAddon(new WebglAddon());
    term.loadAddon(new WebLinksAddon());
    term.loadAddon(fitAddon);

    const regular = new FontFaceObserver(fontFamily).load();
    const bold = new FontFaceObserver(fontFamily, {
      weight: 'bold',
    }).load();

    Promise.all([regular, bold]).then(() => {
      setLoadingFonts(false);
    });
  }, [term]);

  useEffect(() => {
    if (loadingFonts) {
      return;
    }

    term.open(termRef.current);

    fitAddon.fit();

    configureTerminal(term, {
      welcomeText,
      promptPrefix,
      styles: termstyles,
    });

    fitAddon.fit();
    if (!term.element) {
      return;
    }

    // Add base styles
    term.element.setAttribute('style', termstyles);
    setLoadingTerm(false);
  }, [loadingFonts, term]);

  useEffect(() => {
    fitAddon.fit();
  }, [loadingTerm, term, process.window.size]);

  if (loadingFonts) {
    return <div className={styles.loading} />;
  }

  return (
    <div id="xterm-container" className={styles.terminal} ref={termRef}></div>
  );
};

export default Terminal;
