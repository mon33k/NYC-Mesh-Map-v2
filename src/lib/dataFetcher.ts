import 'dotenv/config'
import { error, log } from 'node:console'
import { writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(dirname(__filename), '..')

const OUTPUT_DIR = join(__dirname, 'data')

const MESHDB_API_URL = process.env.MESHDB_API_URL
const MESHDB_API_TOKEN = process.env.MESHDB_API_TOKEN

export async function getMeshDbData(endpoint: string) {
    const response = await fetch(`${MESHDB_API_URL}/api/v1/${endpoint}/?format=json&page_size=4000`,
        {
            headers: {
                Authorization: `Token ${MESHDB_API_TOKEN}`,
                Accept: 'application/json',
            },
        },
    )

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
            `MeshDB returned ${response.status}: ${errorText}`
        )
    }
    return response.json()
}

export async function buildDataFiles() {
    if (!MESHDB_API_URL || !MESHDB_API_TOKEN) {
        const nodesPath = join(OUTPUT_DIR, 'nodes.json')
        try {
            await access(nodesPath)
            log('No MESHDB_API_URL or MESHDB_API_TOKEN set, but data files already exist — skipping fetch.')
            return
        } catch {
            error('No MESHDB_API_URL or MESHDB_API_TOKEN set, and no data files found. Cannot start without data.')
            process.exit(1)
        }
    }

    log('Fetching data from MeshDB API…')

    await mkdir(OUTPUT_DIR, { recursive: true })

    const nodes = await getMeshDbData('nodes')
    const installs = await getMeshDbData('installs')
    const buildings = await getMeshDbData('buildings')
    const devices = await getMeshDbData('devices')
    const links = await getMeshDbData('links')
    const sectors = await getMeshDbData('sectors')

    await writeFile(
        join(OUTPUT_DIR, 'nodes.json'), JSON.stringify(nodes, null, 2),
    )

    await writeFile(
        join(OUTPUT_DIR, 'installs.json'), JSON.stringify(installs, null, 2),
    )

    await writeFile(
        join(OUTPUT_DIR, 'buildings.json'), JSON.stringify(buildings, null, 2),
    )

    await writeFile(
        join(OUTPUT_DIR, 'devices.json'), JSON.stringify(devices, null, 2),
    )

    await writeFile(
        join(OUTPUT_DIR, 'links.json'), JSON.stringify(links, null, 2),
    )

    await writeFile(
        join(OUTPUT_DIR, 'sectors.json'), JSON.stringify(sectors, null, 2),
    )

    const nodeCount = Array.isArray(nodes) ? nodes.length : nodes.results?.length ?? 0

    const installCount = Array.isArray(installs) ? installs.length : installs.results?.length ?? 0

    log('Done! Data files written to src/data/:')
    log(`  nodes.json (${nodeCount} nodes)`)
    log(`  installs.json (${installCount} installs)`)
    log('  buildings.json')
    log('  devices.json')
    log('  links.json')
    log('  sectors.json')
}

if (process.argv[1]?.endsWith('dataFetcher.ts')) {
    await buildDataFiles()
}
