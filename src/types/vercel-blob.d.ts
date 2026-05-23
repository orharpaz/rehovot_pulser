declare module '@vercel/blob' {
  export function put(
    pathname: string,
    body: Blob | File | ReadableStream | Buffer | string,
    options: { access: 'public' }
  ): Promise<{ url: string; pathname: string; contentType: string; contentDisposition: string }>
}
