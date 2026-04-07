import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileDbService {
  private filePath: string;

  constructor() {
    // DB path is relative to the backend working directory. The developer should
    // `cd backend` before running dev/start scripts (see backend/README.md).
    // Use process.cwd() directly so when running from inside backend/ the
    // resolved path becomes backend/data/db.json (not backend/backend/...).
    const dbPath = process.env.DB_PATH || './data/db.json';
    this.filePath = path.resolve(process.cwd(), dbPath.replace(/^\.\//, ''));
  }

  private async ensureFile() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.access(this.filePath);
    } catch (e) {
      // If file doesn't exist, create with empty donors array
      await fs.writeFile(this.filePath, JSON.stringify({ donors: [] }, null, 2), 'utf-8');
    }
  }

  async read() {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf-8');
    try {
      return JSON.parse(raw);
    } catch (e) {
      // reinitialize if corrupted
      await fs.writeFile(this.filePath, JSON.stringify({ donors: [] }, null, 2), 'utf-8');
      return { donors: [] };
    }
  }

  async write(data: any) {
    await this.ensureFile();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
