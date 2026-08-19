import { PolygonLayer } from '@deck.gl/layers'
import type { Sector } from '../../types/models'
import { getSectorColor, shouldShowSector } from './SectorStyles'

type Position = [number, number] // [long, lat] bc deckgl

// deg to radian bc js trig uses radians
function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180
}

function radiansToDegrees(radians: number) {
    return (radians * 180) / Math.PI
}

// Using distance point formula to find one point from a starting location, direction, and distance
// Under "Destination point given ditance" section here https://www.movable-type.co.uk/scripts/latlong.html
function movePoint(
    startLongitude: number,
    startLatitude: number,
    direction: number, // compass direction in degrees
    distanceInMeters: number, // how far is new point in meters
): Position {
    const earthRadius = 6371000 // earth radius in meters
    const distance = distanceInMeters / earthRadius // convert meter distance 
    const directionInRadians = degreesToRadians(direction) // compass dir to radians
    const startLat = degreesToRadians(startLatitude)
    const startLng = degreesToRadians(startLongitude)
    // find new lat of new point
    // use start lat, distance and direction to find new lat
    const endLat = Math.asin(
        Math.sin(startLat) * Math.cos(distance) +
        // secondpart of destination point formula 
        Math.cos(startLat) *
            Math.sin(distance) *
            Math.cos(directionInRadians),
    )

    const endLng = startLng + Math.atan2(
        Math.sin(directionInRadians) *
            Math.sin(distance) *
            Math.cos(startLat),
        Math.cos(distance) -
            Math.sin(startLat) * Math.sin(endLat),
    )

    return [
        radiansToDegrees(endLng),
        radiansToDegrees(endLat),
    ]
}

// similar to the old Google Maps getPath function of center to points around the outside to center
function getSectorPolygon(sector: Sector) {
    const center: Position = [
        sector.longitude,
        sector.latitude,
    ]

    const points: Position[] = [center]

    const startAngle = sector.azimuth - sector.width / 2 // find angle at left edge sector
    const endAngle = sector.azimuth + sector.width / 2 // find angle at right edge sector
    const radiusInMeters = sector.radius * 1000 // radius converted from km to m

    for (
        let angle = startAngle;
        angle <= endAngle; // keep adding pts until sector right edge
        angle += 3 // moving along sector wedge 3 deg at a time
    ) {
        const point = movePoint(
            sector.longitude,
            sector.latitude,
            angle, // use current angle along sector arc
            radiusInMeters, //keep outer edge pts at sector radius
        )

        points.push(point) // add all this outer edge points to polygon
    }

    points.push(center) // add center again to close wedge shape

    return points // send to deck gl
}

// creates deckgl layer to draw all visible sectors either all or one by selectedNodeId
export function createSectorLayer( sectors: Sector[], selectedNodeId: string | null ) {
    const visibleSectors = sectors.filter((sector) => {
        return shouldShowSector(sector, selectedNodeId)
    })

    return new PolygonLayer<Sector>({
        id: 'sectors',
        data: visibleSectors,

        getPolygon: getSectorPolygon,
        getFillColor: getSectorColor,

        getLineColor: [37, 99, 235, 120],
        getLineWidth: 1,
        lineWidthUnits: 'pixels',

        filled: true,
        stroked: true,
        pickable: false,
    })
}