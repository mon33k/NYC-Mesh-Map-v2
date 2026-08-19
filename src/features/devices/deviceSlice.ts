import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Device, Link } from '../../types/models';

export const fetchDevices = createAsyncThunk('devices/fetchDevices', async () => {
    const localData = await import('../../data/devices.json');
    return localData.default;
});

interface DeviceFilters {
    inactive: boolean;
    active: boolean;
    potential: boolean;
}

interface DeviceState {
    data: Device[];
    filters: DeviceFilters;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DeviceState = {
    data: [],
    filters: {
        inactive: true,
        active: true,
        potential: true,
    },
    status: 'idle',
    error: null,
};

const deviceSlice = createSlice({
    name: 'devices',
    initialState,
    reducers: {
        setDevices(state, action: PayloadAction<Device[]>) {
            state.data = action.payload;
            state.status = 'succeeded';
        },
        toggleDeviceFilter(state, action: PayloadAction<keyof DeviceFilters>) {
            state.filters[action.payload] = !state.filters[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDevices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDevices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.results;
            })
            .addCase(fetchDevices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const selectFilteredDevices = (state: RootState) => {
    const filters = state.devices.filters;
    return state.devices.data.filter((d) =>
        filters[d.status.toLowerCase() as keyof DeviceFilters]
    );
};

// gets node ids connected via links for filtered devices
export const selectConnectedNodeIds = (state: RootState, links: Link[]) => {
    const filteredDevices = selectFilteredDevices(state);
    const deviceIds = new Set(filteredDevices.map((d) => d.id));
    const connectedNodeIds = new Set<string>();

    for (const link of links) {
        if (deviceIds.has(link.from_device.id) || deviceIds.has(link.to_device.id)) {

            const from = state.devices.data.find((d) => d.id === link.from_device.id);
            const to = state.devices.data.find((d) => d.id === link.to_device.id);
            if (from?.node?.id) {
                connectedNodeIds.add(from.node.id);
            }
            if (to?.node?.id) {
                connectedNodeIds.add(to.node.id);
            }
        }
    }

    return Array.from(connectedNodeIds);
};

export const { setDevices, toggleDeviceFilter } = deviceSlice.actions;

export const selectDevices = (state: RootState) => state.devices.data;
export const selectDeviceFilters = (state: RootState) => state.devices.filters;

export default deviceSlice.reducer;
