import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { nodeTypeColors } from '../../types/models'
import {
    selectNodeLegendFilters,
    toggleNodeType,
    clearNodeTypes,
    toggleActive,
    toggleInactive,
} from '../nodes/nodeSlice'

import { selectFilters as selectLinkFilters, toggleFilter } from '../links/linkSlice'

import { selectSectorFilters, toggleSectorFilter } from '../sectors/sectorSlice'

const nodeTypes = [
    'Standard',
    'Hub',
    'Supernode',
    'AP',
    'POP',
    'Remote',
] as const


const NodeLegend = () => {
    const [open, setOpen] = useState(() => window.matchMedia('(min-width: 640px)').matches)
    const dispatch = useAppDispatch()
    const filters = useAppSelector(selectNodeLegendFilters)
    const linkFilters = useAppSelector(selectLinkFilters)
    const sectorFilters = useAppSelector(selectSectorFilters)

    const sectorOptions = [
        ['omni', 'Omni'],
        ['wide', '60 Ghz'],
        ['narrow', '5 Ghz'],
    ] as const

    useEffect(() => {
        const query = window.matchMedia('(min-width: 640px)')
        const onChange = (e: MediaQueryListEvent) => setOpen(e.matches)
        query.addEventListener('change', onChange)
        return () => query.removeEventListener('change', onChange)
    },[])


    return (
        <section className={`absolute right-4 top-16 z-20 max-h-[50vh] overflow-y-auto rounded-lg bg-white px-3 py-2 shadow-lg ${ open ? 'w-40 sm:px-3' : 'w-auto' }`}>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-2 text-xs sm:px-3 text-sm">
                {open ? 'Legend ▾' : 'Legend ▸'}
            </button>
            
            {open && (
                <div className="mt-3">
                    <fieldset>
                        <legend className="mb-2 text-xs font-medium text-gray-500">
                            Node type
                        </legend>

                        <div className="flex flex-col gap-2">
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="node-type"
                                    checked={filters.types.length === 0}
                                    onChange={() =>
                                        dispatch(clearNodeTypes())
                                    }
                                    className="h-4 w-4"
                                />

                                <span>All types</span>
                            </label>

                            {nodeTypes.map((type) => (
                                <label
                                    key={type}
                                    className="flex cursor-pointer items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        name="node-type"
                                        checked={filters.types.includes(type)}
                                        onChange={() =>
                                            dispatch(toggleNodeType(type))
                                        }
                                        className="h-4 w-4"
                                    />

                                    <span
                                        className="h-3 w-3 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: nodeTypeColors[type],
                                        }}
                                    />

                                    <span>
                                        {type === 'Standard' ? 'Node' : type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="mt-3 border-t pt-3">
                        <legend className="text-xs font-medium text-gray-500">
                            Links
                        </legend>

                        <div className="mt-2 flex flex-col gap-2">
                            {([
                                ['vpn', 'VPN', '#cc99ff'],
                                ['fiber', 'Fiber', '#f6be00'],
                                ['wireless', 'Wireless', '#007aff'],
                                ['ethernet', 'Ethernet', '#22c55e'],
                            ] as const).map(([key, label, color]) => (
                                <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={linkFilters[key]}
                                        onChange={() => dispatch(toggleFilter(key))}
                                        className="h-4 w-4"
                                    />

                                    <span
                                        className="h-3 w-3 shrink-0 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />

                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                      <fieldset className="mt-3 border-t pt-3">
                        <legend className="text-xs font-medium text-gray-500">
                            Sectors
                        </legend>

                        {sectorOptions.map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 text-sm capitalize">
                                <input
                                    type="checkbox"
                                    checked={sectorFilters[key]}
                                    onChange={() => dispatch(toggleSectorFilter(key))}
                                />
                                {label}
                            </label>
                        ))}
                    </fieldset>

                    <fieldset className="mt-3 border-t pt-3">
                        <legend className="text-xs font-medium text-gray-500">
                            Status
                        </legend>

                        <div className="mt-2 flex flex-col gap-2">
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.active}
                                    onChange={() => dispatch(toggleActive())}
                                    className="h-4 w-4"
                                />

                                <span>Active</span>
                            </label>

                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.inactive}
                                    onChange={() => dispatch(toggleInactive())}
                                    className="h-4 w-4"
                                />

                                <span>Inactive</span>
                            </label>
                        </div>
                    </fieldset>
                </div>
            )}
        </section>
    )
}

export default NodeLegend