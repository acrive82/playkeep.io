import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import * as tar from "tar";

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function archiveInput(input: string): Promise<{ path: string; cleanup: () => Promise<void> }> {
  const tempDir = join(tmpdir(), `playkeep-${randomUUID()}`);
  await mkdir(tempDir, { recursive: true });
  const archivePath = join(tempDir, `${basename(input)}.tar`);
  await tar.c({ cwd: dirname(input), file: archivePath }, [basename(input)]);
  return {
    path: archivePath,
    cleanup: async () => {
      await rm(tempDir, { recursive: true, force: true });
    }
  };
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
