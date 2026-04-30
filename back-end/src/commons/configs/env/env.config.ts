import * as fs from 'fs';
import * as path from 'path';

export class Environment {
  private static readonly ENV_PRODUCTION = '../../../../.env.production';
  private static readonly ENV_DEVELOPMENT = '../../../../.env.development';

  static get(): string {
    const envFilePath = {
      production: path.resolve(__dirname, this.ENV_PRODUCTION),
      development: path.resolve(__dirname, this.ENV_DEVELOPMENT),
    };

    return fs.existsSync(envFilePath.production) ? envFilePath.production : envFilePath.development;
  }
}
