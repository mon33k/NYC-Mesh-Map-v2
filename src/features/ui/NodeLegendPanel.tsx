import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { nodeTypeColors } from '../../types/models'
import {
    selectNodeLegendFilters,
    setNodeTypeFilter,
    toggleActive,
    toggleInactive,
} from '../nodes/nodeSlice'

import { selectFilters as selectLinkFilters, toggleFilter } from '../links/linkSlice'

const nodeTypes = [
    'Standard',
    'Hub',
    'Supernode',
    'AP',
    'POP',
    'Remote',
] as const

const NodeLegend = () => {
    const dispatch = useAppDispatch()
    const filters = useAppSelector(selectNodeLegendFilters)
    const linkFilters = useAppSelector(selectLinkFilters)

    return (
        <section className="absolute left-3 top-[6.5rem] z-20 max-h-[50vh] w-40 overflow-y-auto rounded-lg bg-white p-3 shadow-lg sm:left-auto sm:right-4 sm:top-16 sm:w-44">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Node legend
            </h2>

            <fieldset>
                <legend className="mb-2 text-xs font-medium text-gray-500">
                    Node type
                </legend>

                <div className="flex flex-col gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="node-type"
                            checked={filters.type === 'all'}
                            onChange={() =>
                                dispatch(setNodeTypeFilter('all'))
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
                                type="radio"
                                name="node-type"
                                checked={filters.type === type}
                                onChange={() =>
                                    dispatch(setNodeTypeFilter(type))
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
                        ['vpn', 'VPN', '#a855f7'],
                        ['fiber', 'Fiber', '#f59e0b'],
                        ['wireless', 'Wireless', '#2563eb'],
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
        </section>
    )
}

export default NodeLegend