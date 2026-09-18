import { addToast } from '@heroui/react';
import { HttpCode } from '@/utils/types';

jest.mock('@heroui/react', () => ({
  ...jest.requireActual('@heroui/react'),
  addToast: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('@/api/client').default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Method } = require('@/api/client');

const BASE_URI = 'http://localhost:8080';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockResponse(status: number, body: object) {
  return Promise.resolve({
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

describe('client request', () => {
  it('GET without body does not append query string', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(HttpCode.OK, { code: HttpCode.OK, message: 'OK', data: null }),
    );
    await request('/post', Method.GET);
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URI}/post`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('GET with body appends query params and skips undefined values', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(HttpCode.OK, { code: HttpCode.OK, message: 'OK', data: null }),
    );
    await request('/video/comment/list', Method.GET, {
      body: { userId: 'u1', videoId: 'v1', extra: undefined },
    });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URI}/video/comment/list?userId=u1&videoId=v1`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('POST with JSON body sets Content-Type and stringified body', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(HttpCode.OK, { code: HttpCode.OK, message: 'OK', data: null }),
    );
    await request('/post/like', Method.POST, {
      body: { userId: 'u1', postId: 'p1' },
    });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URI}/post/like`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ userId: 'u1', postId: 'p1' }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('POST with FormData body omits Content-Type and sends FormData as-is', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(HttpCode.OK, { code: HttpCode.OK, message: 'OK', data: null }),
    );
    const formData = new FormData();
    formData.append('file', new Blob(['a']));
    await request('/user/uploadAvatar', Method.POST, { body: formData });
    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers['Content-Type']).toBeUndefined();
    expect(init.body).toBe(formData);
  });

  it('injects Bearer token when token option is provided', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(HttpCode.OK, { code: HttpCode.OK, message: 'OK', data: null }),
    );
    await request('/user/u1', Method.GET, { token: 'abc' });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URI}/user/u1`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer abc' }),
      }),
    );
  });

  it('returns 401 result and shows toast when unauthorized', async () => {
    mockFetch.mockResolvedValue(mockResponse(HttpCode.UN_AUTHORIZED, {}));
    const result = await request('/user/u1', Method.GET);
    expect(result.code).toBe(HttpCode.UN_AUTHORIZED);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Un Authorized', color: 'danger' }),
    );
  });

  it('returns result and shows warning toast on 400', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(HttpCode.BAD_REQUEST, {
        code: HttpCode.BAD_REQUEST,
        message: 'Bad Request',
        data: 'invalid param',
      }),
    );
    const result = await request('/post', Method.POST, { body: {} });
    expect(result.code).toBe(HttpCode.BAD_REQUEST);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Bad Request', color: 'warning' }),
    );
  });

  it('returns result and shows danger toast on 500', async () => {
    mockFetch.mockResolvedValue(
      mockResponse(HttpCode.INTERNAL_SERVER_ERROR, {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        data: 'server error',
      }),
    );
    const result = await request('/post', Method.GET);
    expect(result.code).toBe(HttpCode.INTERNAL_SERVER_ERROR);
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Internal Server Error', color: 'danger' }),
    );
  });

  it('returns Unknown Error result on network failure', async () => {
    mockFetch.mockRejectedValue(new Error('network down'));
    const result = await request('/post', Method.GET);
    expect(result.code).toBe(HttpCode.INTERNAL_SERVER_ERROR);
    expect(result.message).toBe('Unknown Error');
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'System Error', color: 'danger' }),
    );
  });
});
