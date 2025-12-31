
// Service Worker disabled for this environment to avoid origin mismatch errors.
// In a production PWA environment on a dedicated domain, you would re-enable registration in index.html.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
