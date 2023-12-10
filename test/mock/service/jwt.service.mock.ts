export const MockJwtService = () => ({
  sign: jest.fn().mockReturnValue('token'),
});
