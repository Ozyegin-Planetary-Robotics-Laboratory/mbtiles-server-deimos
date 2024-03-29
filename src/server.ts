import http from 'http'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import mbtiles from './mbtiles.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const empty = path.resolve(__dirname, '../assets/empty.webp')
const index = path.resolve(__dirname, '../assets/index.html')

export interface Options {
    port?: number
    minZoom?: number
    maxZoom?: number
    emptyTile?: string
    indexFile?: string
    silent?: boolean
    tileSize?: number
    zoomOffset?: number
}

const manager = async (
    file: string,
    {
        minZoom = 0,
        maxZoom = 21,
        port = 8080,
        emptyTile = empty,
        indexFile = index,
        silent = false,
        tileSize = 512,
        zoomOffset = -1,
    }: Options,
) => {
    const db = await mbtiles(`${file}?mode=ro`)
    const empty = fs.readFileSync(emptyTile)
    const index = fs
        .readFileSync(indexFile, { encoding: 'utf8' })
        .replace(/PORT/g, port.toString())
        .replace(/MIN_ZOOM/g, minZoom.toString())
        .replace(/MAX_ZOOM/g, maxZoom.toString())
        .replace(/TILE_SIZE/g, tileSize.toString())
        .replace(/ZOOM_OFFSET/g, zoomOffset.toString())

    const server = http.createServer(async (req, res) => {
        if (req.url === '/index.html' || req.url === '/') {
            res.end(index)
            return
        }
        res.setHeader('Access-Control-Allow-Origin', '*')
        const url = new URL(req.url ?? '', 'https://example.org/')
        const x = parseInt(url.searchParams.get('x') ?? '', 10)
        const y = parseInt(url.searchParams.get('y') ?? '', 10)
        const z = parseInt(url.searchParams.get('z') ?? '', 10)
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            res.writeHead(500)
            res.end('x, y and z must be a number')
            return
        }
        if (z > maxZoom) {
            res.writeHead(500)
            res.end('z is too big')
            return
        }
        if (z < minZoom) {
            res.writeHead(500)
            res.end('z is small')
            return
        }

        try {
            const t = await db.get(z, x, y)
            if (!silent) {
                console.log(200, z, x, y)
            }
            res.writeHead(200)
            res.end(t)
        } catch (error) {
            if (!silent) {
                console.log(404, z, x, y, error?.toString())
            }
            res.writeHead(404)
            res.end(empty)
        }
    })

    server.listen(port)
    console.log(`Server listening on port ${port}`)
}

export default manager
