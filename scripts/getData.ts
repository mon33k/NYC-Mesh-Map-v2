import 'dotenv/config'
import { error } from 'node:console'
import { writeFile } from 'node:fs/promises'
import type { Node } from '../src/types/models.ts'

const OUTPUT_DIR = 'src/data'

const MESHDB_API_URL = process.env.MESHDB_API_URL
const MESHDB_API_TOKEN = process.env.MESHDB_API_TOKEN

if (!MESHDB_API_URL && !MESHDB_API_TOKEN) {
    throw error ('Missing API and API_TOKEN')
}

async function getMeshDbData(endpoint: string) {
    const response = await fetch(`${MESHDB_API_URL}/${endpoint}/?format=json&page_size=4000`,
        {
            headers: {
                Authorization: `Token ${MESHDB_API_TOKEN}`,
                Accept: 'application/json',
            },
        },
    )

    if (!response.ok) {
        const errorText = await response.text()
        throw error (
            `MeshDB returned ${response.status}`,
            `Error: ${errorText}`
        )
    }
    return response.json()
}

// const nodes = await getMeshDbData('nodes')
// const installs = await getMeshDbData('installs')
// const buildings = await getMeshDbData('buildings')
// const devices = await getMeshDbData('devices')
// const links = await getMeshDbData('links')
// const sectors = await getMeshDbData('sectors')

// console.log("nodes.results: ", nodes.results[0])

const filteredNodes = (await getMeshDbData('nodes')).filter((node: Node) => {
    return (
        node.status === 'Active' &&
        node.longitude != null &&
        node.latitude != null
    )
})


await writeFile(
    `${OUTPUT_DIR}/nodes.json`, JSON.stringify(filteredNodes, null, 2),
)

// await writeFile(
//     `${OUTPUT_DIR}/installs.json`, JSON.stringify(installs, null, 2),
// )

// await writeFile(
//     `${OUTPUT_DIR}/buildings.json`, JSON.stringify(buildings, null, 2),
// )

// await writeFile(
//     `${OUTPUT_DIR}/devices.json`, JSON.stringify(devices, null, 2),
// )

// await writeFile(
//     `${OUTPUT_DIR}/links.json`, JSON.stringify(links, null, 2),
// )


// await writeFile(
//     `${OUTPUT_DIR}/sectors.json`, JSON.stringify(sectors, null, 2),
// )

// const nodeCount = Array.isArray(nodes) ? nodes.length : nodes.results?.length ?? 0

// const installCount = Array.isArray(installs) ? installs.length : installs.results?.length ?? 0

// console.log('Added successfully nodes.json')
// console.log(`Saved ${nodeCount} nodes`)

// console.log('Added successfully installs.json')
// console.log(`Saved ${installCount} installs`)