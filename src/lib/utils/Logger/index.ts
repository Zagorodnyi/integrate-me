import cliColor from 'colors-cli';
import { dots10 } from 'cli-spinners';

import Multiline from './Multiline';
import { StatusesMap } from './types';
import { IntegrationState, IntegrationStatus } from '../../Integration';

const stdout = Multiline.getInstance(process.stdout);

export class StatusLogger {
  constructor() {}

  private intervals: Record<string, NodeJS.Timeout> = {};
  private statuses: StatusesMap = {};
  private integrationsCount = 0;
  private animation = dots10;
  private loading = {
    frameIndex: 0,
    maxFrameIndex: this.animation.frames.length - 1,
  };

  public registerIntegration(key: string) {
    this.statuses[key] = { status: IntegrationStatus.LOADING };
    this.integrationsCount++;
  }

  public updateState(key: keyof StatusesMap, value: IntegrationState) {
    this.statuses[key] = value;
    const baseLog = `${key}: ${value.status}`;

    switch (value.status) {
      case IntegrationStatus.LOADING:
        this.setLoading(key);
        break;

      case IntegrationStatus.OK:
        clearInterval(this.intervals[key]);
        this.updateLog(key, cliColor.green(baseLog));
        break;

      case IntegrationStatus.ERROR:
        const errorLog = `${baseLog} - ${value.error}`;
        clearInterval(this.intervals[key]);
        this.updateLog(key, cliColor.red(errorLog));
        break;

      case IntegrationStatus.RETRY:
        clearInterval(this.intervals[key]);
        const retryLog =
          `${baseLog} (attempt ${value.attempt}) ` +
          `- ${cliColor.red(value.lastError)}`;
        this.updateLog(key, cliColor.yellow(retryLog));
        break;

      default:
        clearInterval(this.intervals[key]);
        this.updateLog(key, cliColor.faint(baseLog));
    }

    if (
      value.status === IntegrationStatus.OK ||
      value.status === IntegrationStatus.ERROR
    ) {
      this.integrationsCount--;
    }

    if (this.integrationsCount <= 0) {
      return;
    }
  }

  private setLoading(key: string) {
    const intervalId = setInterval(() => {
      let value = this.animation.frames[this.loading.frameIndex];
      this.loading.frameIndex =
        this.loading.frameIndex === this.loading.maxFrameIndex
          ? 0
          : this.loading.frameIndex + 1;

      const line = `${key}: ${value}`;
      this.updateLog(key, cliColor.blue(line));
    }, this.animation.interval);

    this.intervals[key] = intervalId;
  }

  private updateLog(key: string, value: string) {
    stdout.update(key, value);
  }

  start() {
    const initMessage = cliColor.black(
      `\n   ${cliColor.white_bbt(' ==== INTEGRATE ME ==== ')}\n`
    );

    this.updateLog('IntegrateMeTitle', initMessage);

    for (const key in this.statuses) {
      this.updateState(key, { status: IntegrationStatus.LOADING });
    }
  }
}
