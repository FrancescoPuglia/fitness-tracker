import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock motivational quotes API (example)
  http.get('https://zenquotes.io/api/today', () =>
    HttpResponse.json([
      { q: 'Hard work beats talent when talent doesn\'t work hard.', a: 'Tim Notke' }
    ])
  ),

  // Mock other external APIs if needed
  http.get('/api/health', () =>
    HttpResponse.json({ status: 'ok' })
  ),
];