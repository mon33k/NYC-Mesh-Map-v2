type NodeColor = [number, number, number, number]

const colorsByKey: Record<string, NodeColor> = {
    default: [170, 170, 170, 255],
    standard: [255, 45, 85, 255],
    active: [255, 45, 85, 255],
    remote: [255, 45, 85, 255],
    kiosk: [255, 45, 85, 255],
    'nn-assigned': [255, 166, 201, 255],
    dead: [170, 170, 170, 255],
    hub: [90, 200, 250, 255],
    omni: [90, 200, 250, 255],
    supernode: [0, 122, 255, 255],
    sector: [0, 122, 255, 255],
    backbone: [0, 122, 255, 255],
    linknyc: [1, 162, 235, 255],
    pop: [246, 190, 0, 255],
    ap: [0, 255, 0, 255],
    sn: [0, 0, 0, 255],
    'non-hub': [255, 45, 85, 255],
    potential: [119, 119, 119, 255],
    'potential-hub': [119, 119, 119, 255],
    'potential-supernode': [119, 119, 119, 255],
    vpn: [204, 153, 255, 255],
    fiber: [246, 190, 0, 255],
}

export function getNodeIconKey(type = '', status = ''): string {
    const normalizedType = type.toLowerCase().replace(/\s+/g, '-')
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-')

    if (normalizedStatus === 'inactive') return 'dead'
    if (normalizedStatus === 'planned') return 'potential'

    if (
        [
            'ap',
            'hub',
            'pop',
            'remote',
            'standard',
            'supernode',
            'vpn',
            'linknyc',
            'fiber',
            'sector',
            'backbone',
            'sn',
            'omni',
        ].includes(normalizedType)
    ) {
        return normalizedType
    }

    if (normalizedStatus === 'active') return 'active'
    if (normalizedStatus === 'nn-assigned') return 'nn-assigned'

    return 'default'
}

export function getNodeColor(type = '', status = ''): NodeColor {
    const key = getNodeIconKey(type, status)

    return colorsByKey[key] ?? colorsByKey.default
}

export function getNodeSize(type = '') {
    const normalizedType = type.toLowerCase().replace(/\s+/g, '-')

    if (normalizedType === 'supernode') {
        return 15
    }

    if (normalizedType === 'hub') {
        return 10
    }

    if (normalizedType === 'pop') {
        return 5
    }

    return 5
}