// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Execute promises with bounded concurrency to avoid rate limiting
 * @param items Array of items to process
 * @param asyncFn Async function to execute for each item
 * @param concurrency Maximum number of concurrent operations
 * @returns Array of results in the same order as input items
 */
export async function promiseQueue<T, R>(
  items: T[],
  asyncFn: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const index = i;

    const promise = asyncFn(item).then(result => {
      results[index] = result;
    });

    results[index] = promise as unknown as R;

    if (concurrency <= items.length) {
      const e: Promise<void> = promise.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }

  await Promise.all(executing);
  return results;
}
