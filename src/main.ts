import { Hono } from 'hono';
import { Resource } from 'sst';

const VISITORS_KEY = 'visitors';

const app = new Hono();

app.get('/', async (c) => {
  return c.html(generateIndex());
});

app.put('/api/visitors', async (c) => {
  let visitors = Number(await Resource.VisitorsStore.get(VISITORS_KEY));
  if (Number.isNaN(visitors)) visitors = 0;

  visitors += 1;
  await Resource.VisitorsStore.put(VISITORS_KEY, visitors.toString());

  return c.json({ visitors });
});

app.get('/*', async (c) => {
  c.status(404);
  return c.text('Not found');
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

function html(template: TemplateStringsArray, ...parts: (string | number)[]) {
  let result = '';

  for (let i = 0; i < template.length; i++) {
    result += template[i];
    result += parts[i] ?? '';
  }

  return result;
}
