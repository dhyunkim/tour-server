export const MockCacheManager = () => ({
  get: jest.fn().mockResolvedValue(undefined),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
  store: {
    keys: jest.fn().mockResolvedValue(['key']),
    del: jest.fn().mockResolvedValue(undefined),
  },
});
