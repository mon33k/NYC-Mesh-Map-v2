type NodeColor = [number, number, number, number]

const colorsByKey: Record<string, NodeColor> = {
    default: [170, 170, 170, 255], // Gray
    standard: [255, 45, 85, 255], // Red 
    active: [255, 45, 85, 255], // Pink-red
    remote: [255, 45, 85, 255], // Orange — #f9a01b
    kiosk: [255, 45, 85, 255], // Pink-red
    'nn-assigned': [255, 166, 201, 255], // Light pink
    dead: [170, 170, 170, 255], // Gray
    hub: [90, 200, 250, 255], // 
    omni: [90, 200, 250, 255], // Light blue
    supernode: [0, 122, 255, 255], // Purple — #92278f
    sector: [0, 122, 255, 255], // Blue
    backbone: [0, 122, 255, 255], // Blue
    linknyc: [1, 162, 235, 255], // Cyan-blue
    pop: [246, 190, 0, 255], // Yellow — #dace21
    ap: [0, 255, 0, 255], // Dark blue — #01409e
    sn: [0, 0, 0, 255], // Black
    'non-hub': [255, 45, 85, 255], // Pink-red
    potential: [119, 119, 119, 255], // Dark gray
    'potential-hub': [119, 119, 119, 255], // Dark gray
    'potential-supernode': [119, 119, 119, 255], // Dark gray
    vpn: [204, 153, 255, 255], // Light purple
    fiber: [246, 190, 0, 255], // Golden yellow
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