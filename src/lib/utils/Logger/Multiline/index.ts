export class Multiline {
  constructor(stream: NodeJS.Process['stdout'] | NodeJS.Process['stderr']) {
    this.indexes = {};
    this.total = 1;
    this.stream = stream;

    if (!Multiline.instance) {
      Multiline.instance = this;
    }

    return Multiline.instance;
  }

  static instance: Multiline;
  indexes: Record<string, number>;
  total: number;
  stream: NodeJS.Process['stdout'] | NodeJS.Process['stderr'];

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
