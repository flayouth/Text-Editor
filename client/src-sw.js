const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  // Cache CSS, JS and worker requests
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
  new CacheFirst({
    // Set the cache name
    cacheName: 'asset-cache',
    plugins: [
      // Cache responses with these headers with a maximum age of 30 days
      new CacheableResponsePlugin({
        headers: { 'Cache-Control': 'max-age=30' }
      })
    ]
  })
);

