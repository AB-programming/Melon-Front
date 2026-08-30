import '@testing-library/jest-dom';
import { mockStore } from '@/test/mocks/store';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('@/utils/store', () => ({
  useStore: jest.fn((selector) => selector(mockStore)),
}));
