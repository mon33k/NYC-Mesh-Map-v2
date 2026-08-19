import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Node as MeshNode } from '../../types/models'

export type RendererType = 'maplibre'

interface UIState {
    renderer: RendererType
    selectedNode: MeshNode | null
}

const initialState: UIState = {
    renderer: 'maplibre',
    selectedNode: null,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setRenderer(state, action: PayloadAction<RendererType>) {
            state.renderer = action.payload
        },

        setSelectedNode(state, action: PayloadAction<MeshNode>) {
            state.selectedNode = action.payload
        },

        clearSelectedNode(state) {
            state.selectedNode = null
        },
    },
})

export const {
    setRenderer,
    setSelectedNode,
    clearSelectedNode,
} = uiSlice.actions

export const selectSelectedNode = (state: RootState) => state.ui.selectedNode

export default uiSlice.reducer