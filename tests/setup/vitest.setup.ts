import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { server } from '../utils/msw/server';

// MSW setup for API mocking
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Clean up DOM after each test
afterEach(() => {
  document.body.innerHTML = '';
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Date to have consistent tests
const mockDate = new Date('2025-09-11T10:00:00Z');
vi.setSystemTime(mockDate);