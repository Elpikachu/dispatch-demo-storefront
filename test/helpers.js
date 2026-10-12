import { createApp } from '../src/app.js';

/** Starts the app on a random port and returns { url, close }. */
export async function startServer(options) {
  const server = createApp(options).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
