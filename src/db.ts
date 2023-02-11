import { Injectable } from '@decorators/di';
import { JsonDB, Config } from 'node-json-db';
import { LoggerService } from './services';

const DEV_MODE = process.env['NODE_ENV'] !== 'production';
const DB_PATH = DEV_MODE
  ? 'daily-report-db.json'
  : '/var/daily-report/daily-report-db.dat';
const DB_CONFIG = new Config(DB_PATH, true, DEV_MODE);

@Injectable()
export class DataSource {
  private db: JsonDB;

  constructor() {
    this.db = new JsonDB(DB_CONFIG);
    LoggerService.log('info', 'JSON Database Initialized');
  }

  exists(path: string) {
    return this.db.exists(path);
  }

  get<T>(path: string): Promise<T> {
    return this.db.getData(path);
  }

  async getOrCreate<T>(path: string, defaultValue: T) {
    if (await this.exists(path)) {
      return await this.get<T>(path);
    } else {
      await this.save(path, defaultValue);
      return defaultValue;
    }
  }

  getById(path: string, id: string) {
    return this.db.getData(`${path}/${id}`);
  }

  save(path: string, data: Record<string, any>) {
    return this.db.push(path, data);
  }

  delete(path: string) {
    return this.db.delete(path);
  }

  flush() {
    return this.db.reload();
  }
}

const dataSourceInstance = new DataSource();

export default dataSourceInstance;
