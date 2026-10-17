import type { Link } from '../../types/models'

type LinkColor = [number, number, number, number]

const linkColors: Record<string, LinkColor> = {
    Fiber: [246, 190, 0, 255],
    Ethernet: [34, 197, 94, 255],
    VPN: [204, 153, 255, 255],
    '60 GHz': [3, 252, 248, 255]
}

const inactiveLinkColor: LinkColor = [170, 170, 170, 255]

const defaultLinkColor: LinkColor = [0, 122, 255, 255]

export function getLinkColor(link: Link): LinkColor {
    if (link.status === 'Inactive') {
        return inactiveLinkColor
    }

    return linkColors[link.type ?? ''] ?? defaultLinkColor
}