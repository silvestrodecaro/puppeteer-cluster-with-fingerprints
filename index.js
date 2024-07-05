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