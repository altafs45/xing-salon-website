// Where leads are kept. JsonFileStore is for development and small single-server installs; add a
// GoogleSheetsStore or a database store by implementing LeadStore and choosing it in server/config.ts.
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Lead } from '../../src/shared/leadSchema';

export interface LeadRecord {
  leadId: string;
  /** ISO timestamp. */
  createdAt: string;
  /** The validated, sanitised lead; `phone` (and a gift's `recipientPhone`) is "+91XXXXXXXXXX". */
  lead: Lead;
}

export interface LeadStore {
  save(record: LeadRecord): Promise<void>;
}

/** Appends to a JSON array on disk. Writes one at a time, through a temp file, so a crash can't corrupt it. */
export class JsonFileStore implements LeadStore {
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly file: string) {}

  save(record: LeadRecord) {
    const run = this.queue.then(async () => {
      await mkdir(dirname(this.file), { recursive: true });
      let all: LeadRecord[] = [];
      try {
        all = JSON.parse(await readFile(this.file, 'utf8'));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      all.push(record);
      const temp = `${this.file}.tmp`;
      await writeFile(temp, JSON.stringify(all, null, 2));
      await rename(temp, this.file);
    });
    // A failed write doesn't block the ones after it.
    this.queue = run.catch(() => undefined);
    return run;
  }
}

/** Keeps leads in memory: for tests. */
export class MemoryStore implements LeadStore {
  readonly records: LeadRecord[] = [];
  async save(record: LeadRecord) {
    this.records.push(record);
  }
}
