import type { ConsoleStream } from '../types';

export class Multiline {
  private constructor(stream: ConsoleStream) {
    this.indexes = {};
    this.total = 1;
    this.stream = stream;
  }

  public static getInstance(stream: ConsoleStream): Multiline {
    if (!Multiline.instance) {
      Multiline.instance = new Multiline(stream);
    }

    return Multiline.instance;
  }

  static instance: Multiline;
  indexes: Record<string, number>;
  total: number;
  stream: ConsoleStream;

  update(key: string, msg: string) {
    const index = this.indexes[key];
    const output = this.stream;
    const isNew = index === undefined;

    let toMove = 0;
    let line = msg;
    if (isNew) {
      line += '\n';
      this.indexes[key] = this.total++;
    } else {
      toMove = index - this.total;
      output.moveCursor?.(0, toMove);
      output.clearLine?.(0);
    }

    output.write(line);
    output.moveCursor?.(-line.length, -toMove);
  }
}

export default Multiline;
