
// ----- OLD NODE STRUCTURE ----
// Structure of each node 
// export interface Node {
//     id: number;: 
//     coordinates: [number, number, number]; // Long, Lat, Elevation
//     requestDate: number;
//     roofAccess: boolean;
//     panoramas: string[];
//     status: string;
//     type: string;
// }

// ---- MESH DB STRUCTURE ----
export interface Node {
    placement: string | number | null | undefined;
    id: string;
    buildings: { id: string }[];
    devices: { id: string }[];
    installs: { id: string; install_number: number }[];
    network_number: number | null;
    name: string | null;
    status: string; // 'Inactive' | 'Active' | 'Planned';
    type: string; // 'Standard' | 'Hub' | 'Supernode' | 'POP' | 'AP' | 'Remote';
    latitude: number;
    longitude: number;
    altitude: number | null;
    install_date: string | null; //ISO
    abandon_date: string | null; //ISO
    notes: string | null;
}



// ------ OLD LINKS -----
// export interface Link {
//     fromNode: Node;
//     toNode: Node;
//     status: 'vpn' | 'fiber' | 'active';
// }


// --- MESH DB LINKS ----
export interface Link {
    id: string;
    status: string | null; //  'Inactive' | 'Planned' | 'Active';
    type?: string | null;//'5 GHz' | '24 GHz' | '60 GHz' | '70-80 GHz' | 'VPN' | 'Fiber' | 'Ethernet' | null;
    install_date: string | null;//ISO
    abandon_date: string | null;//ISO
    description: string | null;
    notes: string | null;
    uisp_id: string | null;
    from_device: { id: string };
    to_device: { id: string };
}

export interface Device {
    id: string;
    latitude: number;
    longitude: number;
    altitude: number | null;
    links_from: { id: string }[];
    links_to: { id: string }[];
    name: string | null;
    status: string, // 'Inactive' | 'Active' | 'Potential';
    install_date: string | null;
    abandon_date: string | null;
    notes: string | null;
    uisp_id: string | null;
    node: {
        id: string;
        network_number: number | null;
    };
}

export interface CoordRenderLink extends Link {
    fromDevice: Device;
    toDevice: Device;
    fromNode: Node;
    toNode: Node;
    coordinates: [[number, number], [number, number]];

}

export interface Building {
    id: string;
    installs: {
        id: string;
        install_number: number;
    }[];
    bin: number | null;
    street_address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    address_truth_sources: (
        | 'OSMNominatim'
        | 'OSMNominatimZIPOnly'
        | 'NYCPlanningLabs'
        | 'PeliasStringParsing'
        | 'ReverseGeocodeFromCoordinates'
        | 'HumanEntry'
    )[];
    latitude: number;
    longitude: number;
    altitude: number | null;
    notes: string | null;
    panoramas: string[] | null;
    primary_node: {
        id: string;
        network_number: number | null;
    } | null;
    nodes: {
        id: string;
        network_number: number | null;
    }[];
}

export interface Install {
    id: string;
    request_date: string; // ISO
    install_fee_billing_datum: {
        id: string;
        status: 'ToBeBilled' | 'Billed' | 'NotBillingDuplicate' | 'NotBillingOther';
        billing_date: string | null;
        invoice_number: string | null;
        notes: string | null;
    } | null;
    install_number: number;
    status:
    | 'Request Received'
    | 'Pending'
    | 'Blocked'
    | 'Active'
    | 'Inactive'
    | 'Closed'
    | 'NN Reassigned';
    ticket_number: string | null;
    stripe_subscription_id: string | null;
    install_date: string | null;
    abandon_date: string | null;
    unit: string | null;
    roof_access: boolean;
    referral: string | null;
    notes: string | null;
    diy: boolean | null;
    node: {
        id: string;
        network_number: number | null;
    } | null;
    building: {
        id: string;
    };
    member: {
        id: string;
    };
    additional_members: {
        id: string;
    }[];
}

export interface Sector {
    id: string;
    latitude: number;
    longitude: number;
    altitude: number;
    links_from: { id: string }[];
    links_to: { id: string }[];
    name: string | null;
    status: 'Inactive' | 'Active' | 'Potential';
    install_date: string | null;
    abandon_date: string | null;
    notes: string | null;
    uisp_id: string | null;
    radius: number; // in km
    azimuth: number;
    width: number;
    node: {
        id: string;
        network_number: number | null;
    };
}

export const nodeTypeColors: Record<string, string> = {
    Supernode: '#f7941d',
    Hub: '#00aeef',
    POP: '#8dc63f',
    AP: '#92278f',
    Standard: '#eb0c0c',
    Remote: '#f9a01b',
}

export const defaultNodeColor = '#e63946'

export const nodeStatusOpacity = {
    Active: 1,
    Planned: 0.6,
    Inactive: 0.3,
} as const

export const defaultCenter: [number, number] = [
    -73.9595798,
    40.72,
]

export const defaultZoom = 11