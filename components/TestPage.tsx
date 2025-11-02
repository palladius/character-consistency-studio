import React, { useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface TestPageProps {
  onBack: () => void;
}

const TestPage: React.FC<TestPageProps> = ({ onBack }) => {
  const runnerImported = useRef(false);

  useEffect(() => {
    // Prevent re-running tests on component re-renders if it's not unmounted
    if (runnerImported.current) return;
    
    // Clear previous results when component mounts
    const resultsContainer = document.getElementById('test-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }

    import('../tests/metadata.test.ts')
      .catch(err => console.error("Failed to load test runner:", err));
    
    runnerImported.current = true;
  }, []);

  return (
    <div className="flex-grow bg-slate-900 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold">
          <div className="w-5 h-5">{ICONS.back}</div>
          <span>Back to Studio</span>
        </button>
        <h1 className="text-3xl font-bold text-white mb-6">Unit Test Results</h1>
        <div id="test-results"></div>
      </div>
    </div>
  );
};

export default TestPage;
