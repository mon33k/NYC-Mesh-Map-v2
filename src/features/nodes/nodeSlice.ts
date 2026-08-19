import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Node } from '../../types/models';
import type { RootState } from '../../app/store';

export const fetchNodes = createAsyncThunk('nodes/fetchNodes', async () => {
    const localData = await import('../../data/nodes.json');

    return localData.default;
});


interface NodeState {
    data: Node[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NodeState = {
    data: [],
    status: 'idle',
    error: null,
};

const nodeSlice = createSlice({
    name: 'nodes',
    initialState,
    reducers: {
        setNodes(state, action: PayloadAction<Node[]>) {
            state.data = action.payload;
            state.status = 'succeeded';
        },
        clearNodes(state) {
            state.data = [];
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNodes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNodes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.results;
            })
            .addCase(fetchNodes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { setNodes, clearNodes } = nodeSlice.actions;
export const selectNodes = (state: RootState) => state.nodes.data;
export default nodeSlice.reducer;
