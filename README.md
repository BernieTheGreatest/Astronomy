# Daily Cosmos

A responsive, dependency-free webpage for NASA’s Astronomy Picture of the Day. Browse today or a date since June 16, 1995, read the explanation and credits, open full resolution images, and follow video entries.

## Run

Use Node.js 22 or later:

```sh
npm start
```

The server uses port 3000; set `PORT` to override it. No installation or build is needed. Run `npm test` for the API client tests.

## NASA access

The browser fetches `https://api.nasa.gov/planetary/apod` using NASA’s public `DEMO_KEY`. Demo access is rate limited (typically 30 requests/hour and 50/day per IP). For more usage, obtain a key at https://api.nasa.gov/ and enter it under **NASA API access**. The key is kept in tab memory only. Client-side keys are visible to users; a public production deployment needing a protected key should add a server-side proxy and rate limiting.

Network access must allow `api.nasa.gov` and the image/video destinations returned by APOD. Image hosts vary by entry. Videos open at their provider rather than loading third-party iframes automatically. There are no required credentials for demo mode.

## Deployment

The HTML, CSS and JavaScript files can be deployed to a static host at its root. The included Node server is for local development. NASA content may carry third-party copyrights; consult each entry’s credits before reuse.

## Validation

Unit tests cover dates, image/video API responses, URL validation, rate limits, and malformed data. They use fixtures and do not establish live NASA connectivity. Live API and visual browser checks should also be performed where network access is available.
