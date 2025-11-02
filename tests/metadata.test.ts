import { describe, it, expect } from './test-runner';
import metadata from '../metadata.json';

// This file is imported as a module into the TestPage component.
// The tests will run automatically upon loading the component.

function runMetadataTests() {
  describe('Application Metadata (metadata.json)', () => {
    it('should be imported successfully', () => {
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
}

runMetadataTests();
