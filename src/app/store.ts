import { configureStore } from '@reduxjs/toolkit';
import nodesReducer     from '../features/nodes/nodeSlice';
import linksReducer     from '../features/links/linkSlice';
import devicesReducer   from '../features/devices/deviceSlice';
import buildingsReducer from '../features/buildings/buildingSlice';
import sectorReducer from '../features/sectors/sectorSlice';
import mapReducer  from '../features/map/mapSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        nodes: nodesReducer,
        links: linksReducer,
        devices: devicesReducer,
        buildings: buildingsReducer,
        sectors: sectorReducer,
        map: mapReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
