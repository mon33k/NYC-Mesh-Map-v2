import 'dotenv/config'
import { mkdir, writeFile } from 'node:fs/promises'

const OUTPUT_DIR = 'src/data'

const MESHDB_API_URL = process.env.MESHDB_API_URL
const MESHDB_API_TOKEN = process.env.MESHDB_API_TOKEN

if (!MESHDB_API_URL || !MESHDB_API_TOKEN) {
    throw new Error(
        'Missing MESHDB_API_URL or MESHDB_API_TOKEN',
    )
}

async function getMeshDbData(endpoint: string) {
    const response = await fetch(
        `${MESHDB_API_URL}/${endpoint}/?format=json&page_size=4000`,
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
            `MeshDB returned ${response.status}: ${errorText}`,
        )
    }

    return response.json()
}

const nodesResponse = await getMeshDbData('nodes')
const devicesResponse = await getMeshDbData('devices')
const linksResponse = await getMeshDbData('links')
const sectorsResponse = await getMeshDbData('sectors')
const buildingsResponse = await getMeshDbData('buildings')


const nodes = nodesResponse.results ?? []
const devices = devicesResponse.results ?? []
const links = linksResponse.results ?? []
const sectors = sectorsResponse.results ?? []
const buildings = buildingsResponse.results ?? []


const filteredNodes = nodes
    .filter((node) => {
        return (
            node.longitude != null &&
            node.latitude != null
        )
    })
    .map((node) => {
        return {
            id: node.id,
            network_number: node.network_number,
            name: node.name,
            status: node.status,
            type: node.type,
            longitude: node.longitude,
            latitude: node.latitude,
        }
    })


const filteredDevices = devices
    .filter((device) => {
        return (
            device.longitude != null &&
            device.latitude != null
        )
    })
    .map((device) => {
        return {
            id: device.id,
            longitude: device.longitude,
            latitude: device.latitude,
        }
    })


const filteredLinks = links.map((link) => {
    return {
        id: link.id,
        status: link.status,
        type: link.type,
        from_device: {
            id: link.from_device.id,
        },
        to_device: {
            id: link.to_device.id,
        },
    }
})


const filteredSectors = sectors
    .filter((sector) => {
        return (
            sector.longitude != null &&
            sector.latitude != null &&
            sector.radius != null &&
            sector.azimuth != null &&
            sector.width != null
        )
    })
    .map((sector) => {
        return {
            id: sector.id,
            status: sector.status,
            longitude: sector.longitude,
            latitude: sector.latitude,
            radius: sector.radius,
            azimuth: sector.azimuth,
            width: sector.width,
            node: {
                id: sector.node.id,
                network_number: sector.node.network_number,
            },
        }
    })


const filteredBuildings = buildings
    .filter((building) => {
        return (
            building.longitude != null &&
            building.latitude != null
        )
    })
    .map((building) => {
        return {
            id: building.id,
            street_address: building.street_address,
            city: building.city,
            state: building.state,
            zip_code: building.zip_code,
            longitude: building.longitude,
            latitude: building.latitude,
        }
    })


await mkdir(OUTPUT_DIR, {
    recursive: true,
})

await writeFile(
    `${OUTPUT_DIR}/nodes.json`,
    JSON.stringify(filteredNodes, null, 2),
)

await writeFile(
    `${OUTPUT_DIR}/devices.json`,
    JSON.stringify(filteredDevices, null, 2),
)

await writeFile(
    `${OUTPUT_DIR}/links.json`,
    JSON.stringify(filteredLinks, null, 2),
)

await writeFile(
    `${OUTPUT_DIR}/sectors.json`,
    JSON.stringify(filteredSectors, null, 2),
)

await writeFile(
    `${OUTPUT_DIR}/buildings.json`,
    JSON.stringify(filteredBuildings, null, 2),
)

console.log('Added successfully: ')
console.log(`Saved ${filteredNodes.length} nodes`)
console.log(`Saved ${filteredDevices.length} devices`)
console.log(`Saved ${filteredLinks.length} links`)
console.log(`Saved ${filteredSectors.length} sectors`)