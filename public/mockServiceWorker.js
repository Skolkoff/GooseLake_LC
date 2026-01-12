
/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.7.0).
 * @see https://github.com/mswjs/msw
 * - Please do not modify this file.
 * - Please do not delete this file.
 * - Please do not move this file.
 */

const INTEGRITY_CHECKSUM = '2e95655a1532057d1976a4459f074d20'
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !self.clients) {
    return
  }

  const client = await self.clients.get(clientId)

  if (!client) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(client, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)
      break
    }

    default: {
      const client = await self.clients.get(clientId)
      if (activeClientIds.has(clientId)) {
        await handleRequest(event, client)
      }
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { request } = event
  const accept = request.headers.get('accept') || ''

  // Bypass server-sent events.
  if (accept.includes('text/event-stream')) {
    return
  }

  // Bypass navigation requests.
  if (request.mode === 'navigate') {
    return
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  // Bypass all requests when there are no active clients.
  // If the worker was activated but no client has yet sent
  // the "MOCK_ACTIVATE" message, we shouldn't handle requests.
  if (activeClientIds.size === 0) {
    return
  }

  // Generate unique request ID.
  const requestId = Math.random().toString(36).slice(2)

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      // If the request is aborted, ignore it.
      if (error.name === 'AbortError') {
        return
      }

      // If the request failed due to a network error, warn the user.
      if (error.name === 'NetworkError') {
        console.warn(
          '[MSW] A request did not establish a network connection because of a network error.',
        )
        return
      }

      console.error(
        `[MSW] Uncaught exception in the request handler for "${request.method} ${request.url}":`,
        error,
      )

      return fetch(request)
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await self.clients.get(event.clientId)
  const originalResponse = await fetch(event.request.clone())

  if (!client) {
    return originalResponse
  }

  const responsePromise = sendToClient(client, {
    type: 'REQUEST',
    payload: {
      id: requestId,
      url: event.request.url,
      method: event.request.method,
      headers: Object.fromEntries(event.request.headers.entries()),
      cache: event.request.cache,
      mode: event.request.mode,
      credentials: event.request.credentials,
      destination: event.request.destination,
      integrity: event.request.integrity,
      redirect: event.request.redirect,
      referrer: event.request.referrer,
      referrerPolicy: event.request.referrerPolicy,
      body: await event.request.clone().arrayBuffer(),
      bodyUsed: event.request.bodyUsed,
      keepalive: event.request.keepalive,
    },
  })

  const mockedResponse = await responsePromise

  if (mockedResponse) {
    const { status, statusText, headers, body, delay } = mockedResponse

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    return new Response(body, {
      status,
      statusText,
      headers: new Headers(headers),
    })
  }

  return originalResponse
}

function sendToClient(client, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(message, [channel.port2])
  })
}
