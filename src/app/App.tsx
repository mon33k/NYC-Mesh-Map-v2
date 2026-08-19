import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './hooks';
import { fetchNodes }   from '../features/nodes/nodeSlice';
import { fetchDevices } from '../features/devices/deviceSlice';
import { fetchLinks }   from '../features/links/linkSlice';
import {fetchBuildings } from '../features/buildings/buildingSlice';
import { fetchSectors } from '../features/sectors/sectorSlice';
import Header from '../features/ui/Header';
import Home from '../components/Home';

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchNodes());
        dispatch(fetchDevices());
        dispatch(fetchLinks());
        dispatch(fetchBuildings());
        dispatch(fetchSectors()); 
    }, [dispatch]);

    return (
        <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
            <Header />
            <main className="flex-1 overflow-hidden flex flex-col">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </div>
    );
}
