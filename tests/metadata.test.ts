import { describe, it, expect } from './test-runner';

// This file is imported as a module into test.html
// The tests will run automatically upon loading the page.

async function runMetadataTests() {
  try {
    const response = await fetch('/metadata.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata.json: ${response.statusText}`);
    }
    const metadata = await response.json();

    describe('Application Metadata (metadata.json)', () => {
      it('should fetch and parse successfully', () => {
        expect(metadata).toBeDefined();
      });

      it('should contain a version string', () => {
        expect(metadata.version).toBeDefined();
        expect(typeof metadata.version).toBe('string');
      });

      it('should have a version that follows semantic versioning (e.g., 0.0.1)', () => {
        expect(metadata.version).toMatch(/^\d+\.\d+\.\d+$/);
      });

      it('should have a non-empty name', () => {
        expect(metadata.name).toBeDefined();
        expect(typeof metadata.name).toBe('string');
        expect(metadata.name.length > 0).toBeTruthy();
      });

      it('should have a description', () => {
        expect(metadata.description).toBeDefined();
        expect(typeof metadata.description).toBe('string');
      });

      it('should have requestFramePermissions as an array', () => {
        expect(Array.isArray(metadata.requestFramePermissions)).toBeTruthy();
      });
    });
  } catch (error) {
    describe('Application Metadata (metadata.json)', () => {
      it('should load and be valid', () => {
        // This will fail the test and show the error from the catch block
        throw error;
      });
    });
  }
}

runMetadataTests();
