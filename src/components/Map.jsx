import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StoreMapCanvas from "./MapCanvas";
import StoreGrid from "./StoreGrid";

const Map = () => {
    const [view, setView] = useState("comp_rail");
    const [isBlueprint, setIsBlueprint] = useState(false);
    const [placementMode, setPlacementMode] = useState("label"); // New: "label" or "display"
    const [searchQuery, setSearchQuery] = useState("");
    const [displays, setDisplays] = useState([]);
    const [labels, setLabels] = useState([]); // New state for labels
    const [loading, setLoading] = useState(false);

    // 1. Fetch Displays AND Labels
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [dispRes, labRes] = await Promise.all([
                supabase.from("displays").select("*").eq("zone", view),
                supabase.from("labels").select("*").eq("zone", view)
            ]);

            if (!dispRes.error) setDisplays(dispRes.data || []);
            if (!labRes.error) setLabels(labRes.data || []);
            setLoading(false);
        };
        fetchData();
    }, [view]);

    // 2. Handle Saves (Displays)
    const handleSave = async (displayId, updates) => {
        setDisplays(prev => prev.map(d => d.id === displayId ? { ...d, ...updates } : d));
        await supabase.from("displays").update({ ...updates, updated_at: new Date() }).eq("id", displayId);
    };

    // 3. Blueprint: Add Logic
    const handleAddItem = async (col, row) => {
        if (placementMode === "display") {
            const id = window.prompt("New Display ID:");
            if (!id) return;
            const newDisp = { id, col, row, zone: view, manual_name: "" };
            const { data, error } = await supabase.from("displays").insert([newDisp]).select();
            if (!error) setDisplays(prev => [...prev, data[0]]);
        } else {
            const text = window.prompt("Label Text (e.g. Aisle 1):");
            if (!text) return;
            const newLab = { text, col, row, zone: view };
            const { data, error } = await supabase.from("labels").insert([newLab]).select();
            if (!error) setLabels(prev => [...prev, data[0]]);
        }
    };

    // 4. Blueprint: Delete Logic
    const handleDeleteItem = async (id, type) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        const table = type === "display" ? "displays" : "labels";
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (!error) {
            if (type === "display") setDisplays(prev => prev.filter(d => d.id !== id));
            else setLabels(prev => prev.filter(l => l.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-2 md:p-4 pb-24">
            <div className="max-w-[2400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sticky top-0 z-[100] bg-base-200/80 backdrop-blur pb-4">
                    
                    <div className="flex gap-2 items-center">
                        <div className="tabs tabs-boxed bg-base-100 border border-base-300">
                            <button className={`tab ${view === 'comp_rail' ? 'tab-active' : ''}`} onClick={() => setView('comp_rail')}>Comp Rail</button>
                            <button className={`tab ${view === 'end_cap' ? 'tab-active' : ''}`} onClick={() => setView('end_cap')}>End Caps</button>
                        </div>
                    </div>

                    <div className="relative w-full max-w-md">
                        <input type="text" placeholder="🔍 Search items..." className="input input-bordered w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-2 bg-base-100 p-2 rounded-lg border border-base-300 shadow-sm">
                        {isBlueprint && (
                            <select 
                                className="select select-bordered select-sm font-bold text-primary"
                                value={placementMode}
                                onChange={(e) => setPlacementMode(e.target.value)}
                            >
                                <option value="label">Mode: Label</option>
                                <option value="display">Mode: Display</option>
                            </select>
                        )}
                        <button 
                            onClick={() => setIsBlueprint(!isBlueprint)}
                            className={`btn btn-sm ${isBlueprint ? 'btn-secondary' : 'btn-ghost border-base-300'}`}
                        >
                            {isBlueprint ? "EXIT EDIT" : "⚙️ LAYOUT"}
                        </button>
                    </div>
                </div>

                <StoreMapCanvas cols={view === 'comp_rail' ? 12 : 42} rows={20}>
                    <StoreGrid 
                        zone={view}
                        displays={displays}
                        labels={labels} // New prop
                        searchQuery={searchQuery}
                        isBlueprint={isBlueprint}
                        onSave={handleSave}
                        onAddItem={handleAddItem} // Unified add function
                        onDeleteItem={handleDeleteItem} // Unified delete function
                        cols={view === 'comp_rail' ? 12 : 42}
                        rows={20}
                    />
                </StoreMapCanvas>
            </div>
        </div>
    );
};

export default Map;