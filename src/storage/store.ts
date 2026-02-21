import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Store } from "../types/store.js";
import * as fs from "node:fs/promises";

const DATA_FILE = join(process.cwd(), "data.json");

export const store: Store = {
  books: [],
  users: [],
  loans: [],
};

export function loadData(): void {
  if (!existsSync(DATA_FILE)) return;

  const raw = readFileSync(DATA_FILE, "utf-8");
  const parsed = JSON.parse(raw);

  store.books = parsed.books || [];
  store.users = parsed.users || [];

  if (Array.isArray(parsed.loans)) {
    for (const rawItem of parsed.loans) {
      store.loans.push({
        id: rawItem.id,
        userId: rawItem.userId,
        bookId: rawItem.bookId,
        status: rawItem.status,
        loanDate: new Date(rawItem.loanDate),
        returnDate: rawItem.returnDate ? new Date(rawItem.returnDate) : null,
      });
    }
  } else {
    store.loans = [];
  }
}

let saveQueue = Promise.resolve();

export function saveData(): Promise<void> {
  const snapshot = JSON.stringify(store, null, 2);

  saveQueue = saveQueue.then(() => fs.writeFile(DATA_FILE, snapshot, "utf-8"))
    .catch((err) => {
      console.error("Error saving to disk:", err);
      throw err;
    });

  return saveQueue;
}
