import { atom } from 'nanostores';

type NestedDirectories = { [key: string]: null | NestedDirectories };
export type Permission = typeof READ | typeof WRITE | typeof EXECUTE;
export const READ = 'r';
export const WRITE = 'w';
export const EXECUTE = 'x';

export const CURRENT_DIRECTORY = '.';
export const PREVIOUS_DIRECTORY = '..';

export const Decoder = new TextDecoder();
export const Encoder = new TextEncoder();

export class File {
  public type = 'file';
  public isFile = true;
  private _name: string;
  private _permissions: Permission[];
  private _contents: Uint8Array;
  private _updateAt: Date;
  private readonly _createdAt: Date;

  //#region getters_and_setters
  public get name(): string {
    return this._name;
  }
  private set name(value: string) {
    this._name = value;
  }
  public get permissions(): Permission[] {
    return this._permissions;
  }
  private set permissions(value: Permission[]) {
    this._permissions = value;
  }
  private get contents(): Uint8Array {
    return this._contents;
  }
  private set contents(value: Uint8Array) {
    this._contents = value;
  }
  public get updateAt(): Date {
    return this._updateAt;
  }
  private set updateAt(value: Date) {
    this._updateAt = value;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  //#endregion

  constructor(name: string) {
    if (name.length === 0) {
      throw Error('The file must have a name.');
    }
    this._name = name;
    this._permissions = [READ, WRITE];
    this._contents = new Uint8Array();
    this._updateAt = new Date();
    this._createdAt = new Date();
  }

  public readRaw() {
    return this.contents;
  }

  public read() {
    if (!this.permissions.includes(READ)) {
      throw Error("You don't have permission to read this file.");
    }
    return Decoder.decode(this.contents);
  }

  public writeRaw(content: Uint8Array) {
    this.contents = content;
  }

  public write(content: string) {
    this.contents = Encoder.encode(content);
  }
}

export class Directory {
  public type = 'directory';
  public isDirectory = true;
  private _previousDirectory: Directory | null;
  private _name: string;
  private _contents: (File | Directory)[];
  private _updateAt: Date;
  private readonly _createdAt: Date;

  //#region getters_and_setters
  public get previousDirectory(): Directory | null {
    return this._previousDirectory;
  }
  private set previousDirectory(value: Directory | null) {
    this._previousDirectory = value;
  }
  public get name(): string {
    return this._name;
  }
  private set name(value: string) {
    this._name = value;
  }
  public get contents(): (File | Directory)[] {
    return this._contents;
  }
  private set contents(value: (File | Directory)[]) {
    this._contents = value;
  }
  public get updateAt(): Date {
    return this._updateAt;
  }
  public set updateAt(value: Date) {
    this._updateAt = value;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  //#endregion

  constructor(name: string, previousDirectory: Directory | null) {
    if (name.length === 0) {
      throw Error('The directory must have a name.');
    }
    this._previousDirectory = previousDirectory;
    this._name = name;
    this._contents = [];
    this._updateAt = new Date();
    this._createdAt = new Date();
  }

  public createFile(name: string, content?: string) {
    const newFile = new File(name);
    if (content) {
      newFile.write(content);
    }
    this._contents = [...this._contents, newFile].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  public createNestedDirectories(nestedDirectories: NestedDirectories) {
    for (const [directoryName, content] of Object.entries(nestedDirectories)) {
      this.createDirectory(directoryName);
      if (content !== null) {
        this.findDirectory(directoryName)!.createNestedDirectories(content);
      }
    }
  }

  public createDirectory(name: string) {
    if (name.includes('.')) {
      throw Error('A directory cannot have an extension.');
    }
    if (this.findDirectory(name) !== undefined) {
      throw Error('File or directory already exists.');
    }
    const newDirectory = new Directory(name, this);

    this._contents = [...this._contents, newDirectory].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  public delete(fileOrDirectoryName: string) {
    this._contents = this._contents.filter(
      (fileOrDirectory) => fileOrDirectory.name !== fileOrDirectoryName
    );
  }

  public findDirectory(directoryName: string) {
    return this._contents.find((fileOrDirectory) => {
      return (
        'isDirectory' in fileOrDirectory &&
        fileOrDirectory.name === directoryName
      );
    }) as Directory | undefined;
  }

  public findFile(fileName: string) {
    return this._contents.find((fileOrDirectory) => {
      return 'isFile' in fileOrDirectory && fileOrDirectory.name === fileName;
    }) as File | undefined;
  }

  private _recursePath(currentPath: string[]): string[] {
    if (this._previousDirectory === null) {
      return ['', ...currentPath, ''];
    } else {
      return this._previousDirectory._recursePath([this.name, ...currentPath]);
    }
  }

  public get path() {
    const path = this._recursePath([]).join('/');

    return path;
  }
}

const initialHardDrive = new Directory('/', null);

initialHardDrive.createNestedDirectories({
  home: {
    douugdev: {
      projects: null,
    },
  },
  etc: null,
  lib: {
    python3: null,
  },
  tmp: null,
  usr: null,
});
const homeDir = initialHardDrive
  .findDirectory('home')!
  .findDirectory('douugdev')!;

homeDir.createFile(
  'readme.txt',
  `
  Hello! I'm a software engineer from São Paulo, Brazil.
  I speak Brazilian Portuguese, English, a bit of Spanish and Italian.
  
  Feel free to explore a few of my personal projects using the "open" command, such as:
  
  $ open synth

  Also, use "help" to know which commands are available.
  `
);

const projectsDir = homeDir.findDirectory('projects');

projectsDir?.createFile(
  'thisWebsite.txt',
  'This website is a work in progress'
);
projectsDir?.createFile('synth.txt', 'type "open synth" to see this project');
projectsDir?.createFile(
  'code.ts',
  `// Welcome to douugIDE
// If you're still in the terminal, use \`code\` to open it. 

const printSomething = (param: string) => {
  console.log(param);
}

printSomething('Hello!!');
`
);

export const hardDrive = atom(initialHardDrive);
