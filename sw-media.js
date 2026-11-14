/**
 * 媒体代理 Service Worker
 * 原站前端请求图片时用相对路径 /fast/...，部署到新域名后会 404。
 * 这里把 /fast/* 和 /upload/* 的请求转发回学校服务器，DA 地址不变。
 */
const ORIGIN = 'https://txyr.jxvcie.edu.cn';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  const p = url.pathname;
  if (p.startsWith('/fast/') || p.startsWith('/upload/')) {
    event.respondWith(
      fetch(ORIGIN + p + url.search, { mode: 'cors', credentials: 'omit' })
        .catch(() => new Response('', { status: 504 }))
    );
  }
});
