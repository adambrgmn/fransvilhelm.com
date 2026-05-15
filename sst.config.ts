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
    const kv = new sst.cloudflare.Kv('VisitorsStore');

    const main = new sst.cloudflare.Worker('Main', {
      handler: 'src/main.ts',
      url: true,
      domain: getStageDomain('fransvilhelm.com', $app.stage),
      link: [kv],
    });

    return {
      main_url: main.url,
    };
  },
});

function getStageDomain(domain: string, stage: string) {
  if (stage === 'staging') {
    return { name: `${$app.stage}.${domain}` };
  }

  if (stage === 'production') {
    // Only apply redirects for apex domain
    if (domain.split('.').length === 2) {
      const zone = cloudflare.getZoneOutput({ filter: { name: domain } });

      // oxlint-disable-next-line no-new
      new cloudflare.DnsRecord('WwwRecord', {
        zoneId: zone.id,
        name: `www.${domain}`,
        type: 'CNAME',
        content: domain,
        ttl: 1,
        proxied: true,
        comment: 'Redirect www to apex, managed by SST',
      });

      // oxlint-disable-next-line no-new
      new cloudflare.Ruleset('WwwRedirect', {
        zoneId: zone.id,
        name: 'Redirect www to apex',
        kind: 'zone',
        phase: 'http_request_dynamic_redirect',
        rules: [
          {
            description: `Redirect www.${domain} to ${domain}`,
            expression: `(http.host eq "www.${domain}")`,
            action: 'redirect',
            actionParameters: {
              fromValue: {
                statusCode: 301,
                targetUrl: {
                  expression: `concat("https://${domain}", http.request.uri.path)`,
                },
                preserveQueryString: true,
              },
            },
          },
        ],
      });
    }

    return { name: domain };
  }

  return undefined;
}
