import { Hono } from 'hono';

const index = html`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Frans Vilhelm</title>

      <style>
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .header {
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-end;
          align-items: flex-end;
          width: 100vw;
          height: 100vh;
          padding: 2rem;
        }

        .title {
          font-size: 0.75rem;
          font-family: system-ui, sans-serif;
        }
      </style>
    </head>
    <body>
      <header class="header">
        <h1 class="title">Frans Vilhelm</h1>
      </header>
    </body>
  </html>
`;

const app = new Hono()
  .get('/', (c) => {
    return c.html(index);
  })
  .get('/*', async (c) => {
    c.status(404);
    return c.json({ success: false });
  });

export default app;

function html(template: TemplateStringsArray, ...parts: (string | number)[]) {
  let result = '';

  for (let i = 0; i < template.length; i++) {
    result += template[i];
    result += parts[i];
  }

  return result;
}
