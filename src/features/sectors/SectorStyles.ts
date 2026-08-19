import type { Sector } from '../../types/models'

type Color = [number, number, number, number]

const activeColor: Color = [37, 99, 235, 45]
const potentialColor: Color = [245, 158, 11, 45]
const inactiveColor: Color = [156, 163, 175, 25]

export function shouldShowSector(
    sector: Sector,
    selectedNodeId: string | null,
) {
    if (sector.status === 'Inactive') {
        return false
    }

    if (!selectedNodeId) {
        return true
    }

    return sector.node.id === selectedNodeId
}

export function getSectorColor(sector: Sector): Color {
    if (sector.status === 'Potential') {
        return potentialColor
    }

    if (sector.status === 'Inactive') {
        return inactiveColor
    }

    return activeColor
}