import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store'; 
import type { Link } from '../../types/models';

// Links need to connect to devices that connect to nodes

export const fetchLinks = createAsyncThunk('links/fetchLinks', async () => {
    const localData = await import('../../data/links.json');

    return localData.default;
});

export interface Filters {
    vpn: boolean;
    fiber: boolean;
    wireless: boolean;
    ethernet: boolean;
}

interface linkState {
    data: Link[];
    filters: Filters;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: linkState = {
    data: [],
    filters: {
        vpn: true,
        fiber: true,
        wireless: true,
        ethernet: true,
    },
    status: 'idle',
    error: null,
};

const linkSlice = createSlice({
    name: 'links',
    initialState,
    reducers: {
        setLinks(state, action: PayloadAction<Link[]>) {
            state.data = action.payload;
        },
        toggleFilter(state, action: PayloadAction<keyof Filters>) {
            state.filters[action.payload] = !state.filters[action.payload];
        },
    },
    extraReducers: (builder) => {
            builder
                .addCase(fetchLinks.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(fetchLinks.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    // fix strict casing here for link obj
                    state.data = action.payload.results;
                })
                .addCase(fetchLinks.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.error.message || null;
                });
        },
});



export const { setLinks, toggleFilter } = linkSlice.actions;

export const selectLinks = (state: RootState) => state.links.data;
export const selectFilters = (state: RootState) => state.links.filters;

export default linkSlice.reducer;
