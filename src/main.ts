import { Hono } from 'hono';
import { Resource } from 'sst';

const VISITORS_KEY = 'visitors';

const app = new Hono();

app.get('/', async (c) => {
  return c.html(generateIndex());
});

app.get('/favicon.svg', (c) => {
  return c.text(generateFavicon(), 200, { 'Content-Type': 'image/svg+xml' });
});

app.put('/api/visitors', async (c) => {
  let visitors = Number(await Resource.VisitorsStore.get(VISITORS_KEY));
  if (Number.isNaN(visitors)) visitors = 0;

  visitors += 1;
  await Resource.VisitorsStore.put(VISITORS_KEY, visitors.toString());

  return c.json({ visitors });
});

app.get('/*', async (c) => {
  return c.text('Not found', 404);
});

export default app;

function generateIndex() {
  return html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">
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

        <script type="module">
          try {
            const response = await fetch('/api/visitors', { method: 'PUT' });
            const data = await response.json();
            console.log('Visitors:', data.visitors);
          } catch (error) {
            console.error(error);
          }
        </script>
      </body>
    </html>
  `;
}

function generateFavicon() {
  return html`
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#favicon_gradient)" />
      <defs>
        <linearGradient id="favicon_gradient" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0000ff" />
          <stop offset="1" stop-color="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
  `;
}

function html(template: TemplateStringsArray, ...parts: (string | number)[]) {
  let result = '';

  for (let i = 0; i < template.length; i++) {
    result += template[i];
    result += parts[i] ?? '';
  }

  return result;
}
