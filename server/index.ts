import 'dotenv/config'
import express from 'express'

const app = express()
const port = 3001

app.get('/api/nodes', async (_request, response) => {
    const meshDbResponse = await fetch(`${process.env.MESHDB_API_URL}/nodes`,
        {
            headers: {
                Authorization: `Bearer ${process.env.MESHDB_API_TOKEN}`,
            },
        },
    )

    if (!meshDbResponse.ok) {
        return response.status(500).json({
            error: 'Could not get nodes from MeshDB',
        })
    }

    const meshDbNodes = await meshDbResponse.json()

    response.json(meshDbNodes)
})

app.listen(port, () => {
    console.log(`MeshDB API server running on ${port}`)
})