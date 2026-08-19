import type { Link } from '../../types/models'

type LinkColor = [number, number, number, number]

const linkColors: Record<string, LinkColor> = {
    Fiber: [245, 158, 11, 255],
    Ethernet: [34, 197, 94, 255],
    VPN: [168, 85, 247, 255],
}

const inactiveLinkColor: LinkColor = [156, 163, 175, 255]

const defaultLinkColor: LinkColor = [37, 99, 235, 255]

export function getLinkColor(link: Link): LinkColor {
    if (link.status === 'Inactive') {
        return inactiveLinkColor
    }

    return linkColors[link.type ?? ''] ?? defaultLinkColor
}