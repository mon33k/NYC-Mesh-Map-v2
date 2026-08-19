import { mkdir, readFile, writeFile } from 'node:fs/promises'

const OUTPUT_FILE = 'src/data/panoramas.json'
const NODES_FILE = 'src/data/nodes.json'

// Get every file in the node-db repository recursive=1 means include files inside of dir data/panoramas
const GITHUB_TREE_URL =
    'https://api.github.com/repos/nycmeshnet/node-db/git/trees/master?recursive=1'

// netlify url for image view
const PANORAMA_IMAGE_URL =
    'https://node-db.netlify.app/panoramas'

// go through the nodes.json
const nodesFileText = await readFile(NODES_FILE, 'utf8')
const nodesFile = JSON.parse(nodesFileText)

const nodes = Array.isArray(nodesFile) ? nodesFile : nodesFile.results

if (!Array.isArray(nodes)) {
    throw new Error(
        'Could not find nodes. Expected nodes.json to be an array or have a results array.',
    )
}

// Ask GitHub for the full repository file tree not just default 1k files
const response = await fetch(GITHUB_TREE_URL, {
    headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'nyc-mesh-map',
    },
})

if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
        `Could not get GitHub files. GitHub returned ${response.status}: ${errorText}`,
    )
}

const githubTree = await response.json()

if (githubTree.truncated) {
    throw new Error(
        'GitHub returned an incomplete file list. The repository tree was truncated.',
    )
}

// only get valid image files inside data/panoramas 
const panoramaFiles = githubTree.tree.filter((file) => {
    return (
        file.type === 'blob' &&
        file.path.startsWith('data/panoramas/') &&
        /\.jpe?g$/i.test(file.path)
    )
})

console.log(`Found ${panoramaFiles.length} panorama image files in GitHub`)

// This is new panoramas.json data, keyed by network number
const panoramasByNetworkNumber = {}

for (const node of nodes) {
    if (node.network_number === null || node.network_number === undefined ) {
        continue
    }

    const networkNumber = String(node.network_number)
    const panoramaUrls = []
    const installs = node.installs ?? []

    for (const install of installs) {
        if (install.install_number === null || install.install_number === undefined ) {
            continue
        }

        const installNumber = String(install.install_number)

        // data/panoramas/10336.jpg
        // data/panoramas/7371.jpg
        // data/panoramas/7371a.jpg
        const installPattern = new RegExp(`^data/panoramas/${installNumber}[a-z]*\\.jpe?g$`, 'i', )

        const matchingFiles = panoramaFiles.filter((file) => {
            return installPattern.test(file.path)
        })

        for (const file of matchingFiles) {
            const fileName = file.path.replace('data/panoramas/', '')

            panoramaUrls.push(
                `${PANORAMA_IMAGE_URL}/${fileName}`,
            )
        }
    }

    if (panoramaUrls.length > 0) {
        panoramasByNetworkNumber[networkNumber] = panoramaUrls
    }
}

await mkdir('src/data', { recursive: true })

await writeFile(
    OUTPUT_FILE,
    JSON.stringify(panoramasByNetworkNumber, null, 2),
)

const nodeCount = Object.keys(panoramasByNetworkNumber).length
const panoramaCount = Object.values(panoramasByNetworkNumber,).flat().length

console.log(`Built ${OUTPUT_FILE}`)
console.log(`Found panoramas for ${nodeCount} nodes`)
console.log(`Saved ${panoramaCount} panorama URLs`)