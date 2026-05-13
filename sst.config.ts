// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'fransvilhelm',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'cloudflare',
      providers: {
        cloudflare: { package: '@pulumi/cloudflare', version: '6.15.0' },
      },
    };
  },
  async run() {
    const main = new sst.cloudflare.Worker('Main', {
      handler: 'src/index.ts',
      url: true,
    });

    return {
      url: main.url,
    };
  },
});
