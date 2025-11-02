const resultsContainer = document.getElementById('test-results');

if (!resultsContainer) {
  throw new Error('Could not find #test-results element in the DOM.');
}

let currentSuite: HTMLDivElement | null = null;
let suiteHasFailed = false;

export function describe(name: string, fn: () => void) {
  const suiteEl = document.createElement('div');
  suiteEl.className = 'mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700';

  const titleEl = document.createElement('h2');
  titleEl.className = 'text-xl font-bold text-slate-100 mb-3';
  suiteEl.appendChild(titleEl);

  currentSuite = suiteEl;
  suiteHasFailed = false;
  resultsContainer.appendChild(suiteEl);

  fn();

  // After running all tests in suite, update title
  if (suiteHasFailed) {
    titleEl.textContent = `❌ ${name}`;
    titleEl.classList.add('text-red-400');
  } else {
    titleEl.textContent = `✅ ${name}`;
    titleEl.classList.add('text-green-400');
  }
  currentSuite = null;
}

export function it(name: string, fn: () => void) {
  if (!currentSuite) {
    throw new Error("'it' must be called inside a 'describe' block.");
  }
  const testEl = document.createElement('div');
  testEl.className = 'flex items-center gap-3 mb-2';

  try {
    fn();
    testEl.innerHTML = `
            <span class="text-green-400 font-bold text-sm w-12 flex-shrink-0">[PASS]</span>
            <span class="text-slate-300">${name}</span>
        `;
  } catch (error) {
    suiteHasFailed = true;
    const errorMessage = error instanceof Error ? error.message : String(error);
    testEl.innerHTML = `
            <span class="text-red-400 font-bold text-sm w-12 flex-shrink-0">[FAIL]</span>
            <div class="flex flex-col">
                <span class="text-slate-300">${name}</span>
                <pre class="text-red-300 text-xs mt-1 bg-slate-900 p-2 rounded whitespace-pre-wrap">${errorMessage}</pre>
            </div>
        `;
    testEl.classList.add('items-start');
  }

  currentSuite.appendChild(testEl);
}

interface Matchers {
  toBe(expected: any): void;
  toBeTruthy(): void;
  toBeDefined(): void;
  toMatch(regex: RegExp): void;
  toBeGreaterThan(expected: number): void;
}

export function expect(actual: any): Matchers {
  const prettyPrint = (val: any) => {
    if (typeof val === 'string') return `"${val}"`;
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    return String(val);
  };
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${prettyPrint(actual)} to be ${prettyPrint(expected)}`);
      }
    },
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected ${prettyPrint(actual)} to be truthy`);
      }
    },
    toBeDefined: () => {
      if (actual === undefined || actual === null) {
        throw new Error(`Expected value to be defined, but received ${prettyPrint(actual)}`);
      }
    },
    toMatch: (regex: RegExp) => {
      if (typeof actual !== 'string' || !regex.test(actual)) {
        throw new Error(`Expected ${prettyPrint(actual)} to match ${regex}`);
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${prettyPrint(actual)} to be greater than ${prettyPrint(expected)}`);
      }
    },
  };
}
