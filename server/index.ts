import 'dotenv/config'
import express from 'express'

const app = express()
const port = 3001

const MESHDB_API_URL = process.env.MESHDB_API_URL
const MESHDB_API_TOKEN = process.env.MESHDB_API_TOKEN
const MESHDB_PAGE_SIZE_LIMIT = process.env.MESHD_PAGE_SIZE_LIMIT

if (!MESHDB_API_URL || !MESHDB_API_TOKEN) {
    console.error('MESHDB_API_URL and MESHDB_API_TOKEN are required')
    process.exit(1)
}

type CacheEntry = {
    data: unknown
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const cache: Record<string, CacheEntry> = {}

const ENDPOINTS = ['nodes', 'devices', 'links', 'buildings', 'sectors', 'installs']

async function fetchEndpoint(endpoint: string): Promise<unknown> {
    const meshDbResponse = await fetch(
        `${MESHDB_API_URL}/api/v1/${endpoint}/?format=json&page_size=${MESHDB_PAGE_SIZE_LIMIT}`,
        {
            headers: {
                Authorization: `Token ${MESHDB_API_TOKEN}`,
                Accept: 'application/json',
            },
        },
    )

    if (!meshDbResponse.ok) {
        const errorText = await meshDbResponse.text()
        throw new Error(`MeshDB returned ${meshDbResponse.status}: ${errorText}`)
    }

    return meshDbResponse.json()
}

for (const endpoint of ENDPOINTS) {
    cache[endpoint] = { data: null, status: 'idle', error: null }

    // Fetch all endpoints in parallel on startup
    fetchEndpoint(endpoint)
        .then((data) => {
            cache[endpoint].data = data
            cache[endpoint].status = 'succeeded'
            const count = Array.isArray(data)
                ? data.length
                : (data as { results?: unknown[] }).results?.length ?? 'unknown'
            console.log(`Fetched ${endpoint}: ${count} items`)
        })
        .catch((err) => {
            cache[endpoint].status = 'failed'
            cache[endpoint].error = err.message
            console.error(`Failed to fetch ${endpoint}:`, err.message)
        })
}

for (const endpoint of ENDPOINTS) {
    app.get(`/api/${endpoint}`, (_request, response) => {
        const entry = cache[endpoint]

        if (entry.status === 'failed') {
            return response.status(500).json({
                error: `Could not load ${endpoint}: ${entry.error}`,
            })
        }

        if (entry.status !== 'succeeded') {
            return response.status(503).json({
                error: `${endpoint} is still loading from MeshDB`,
            })
        }

        response.json(entry.data)
    })
}

app.listen(port, () => {
    console.log(`MeshDB API proxy running on http://localhost:${port}`)
})
