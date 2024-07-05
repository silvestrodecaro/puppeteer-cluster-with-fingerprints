# Puppeteer Cluster with Fingerprints

This is a "template" repo that you can use to run multiple instances with unique fingerprints with the [puppeteer-with-fingerprints](https://github.com/CheshireCaat/puppeteer-with-fingerprints) library in conjunction with [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster).
For more details, check out their repositories, and most importantly, support them.

## Installation

First, clone the repository:

```bash
git clone https://github.com/silvestrodecaro/puppeteer-cluster-with-fingerprints.git
cd puppeteer-cluster-with-fingerprints
```

Then install the dependencies:

```bash
npm install puppeteer puppeteer-with-fingerprints puppeteer-cluster
```

## Usage

Here's an example of how to use the script:

```js
const { plugin } = require("puppeteer-with-fingerprints");
const { Cluster } = require('puppeteer-cluster');

(async () => {
    // Get a fingerprint from the server:
    const fingerprint = await plugin.fetch('', {
        tags: ['Microsoft Windows', 'Chrome'],
    });

    // Apply fingerprint:
    plugin.useFingerprint(fingerprint);

    const cluster = await Cluster.launch({
        puppeteer: plugin,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
            headless: false,
        },
    });

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        await page.screenshot({ path: `${ await page.title() }.png`});
        // Store screenshot, do something else
    });

    cluster.queue('http://www.google.com/');
    cluster.queue('http://www.wikipedia.org/');
    // many more pages

    await cluster.idle();
    await cluster.close();
})();
```

## WARNING

This project relies on the 'puppeteer-with-fingerprints' and 'puppeteer-cluster' libraries, which in turn depend on [Puppeteer Framework](https://github.com/puppeteer/puppeteer). As Puppeteer is constantly being updated, there may be issues with regressions and compatibility. It is recommended to frequently check for updates and test your implementation to ensure continued functionality.

## License

This project is licensed under the MIT License.