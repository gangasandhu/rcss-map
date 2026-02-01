import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StoreMapCanvas from "./MapCanvas";
import StoreGrid from "./StoreGrid";
import DisplayDetail from "./DisplayDetail";

const Map = () => {
    const ZONES = [
        { id: "comp_rail", label: "Comp Rail", cols: 12 },
        { id: "end_cap", label: "End Caps", cols: 42 },
        { id: "dairy", label: "Dairy", cols: 24 },
        { id: "meat", label: "Meat", cols: 50 },
        { id: "deli", label: "Deli", cols: 15 },
    ];

    const [view, setView] = useState("comp_rail");
    const [isBlueprint, setIsBlueprint] = useState(false);
    const [placementMode, setPlacementMode] = useState("label");
    const [searchQuery, setSearchQuery] = useState("");
    const [displays, setDisplays] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDisplay, setSelectedDisplay] = useState(null);

    const currentZone = ZONES.find(z => z.id === view) || ZONES[0];

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

    const handleSave = async (displayId, updates) => {
        // Optimistic Update
        setDisplays(prev => prev.map(d => d.id === displayId ? { ...d, ...updates } : d));
        await supabase.from("displays").update({ ...updates, updated_at: new Date() }).eq("id", displayId);
    };

    const handleAddItem = async (col, row) => {
        if (placementMode === "display") {
            const { data, error } = await supabase.from("displays").insert([{ col, row, zone: view, manual_name: "" }]).select();
            if (!error) setDisplays(prev => [...prev, data[0]]);
        } else {
            const text = window.prompt("Label Text:");
            if (!text) return;
            const { data, error } = await supabase.from("labels").insert([{ text, col, row, zone: view }]).select();
            if (!error) setLabels(prev => [...prev, data[0]]);
        }
    };

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
        <div className="min-h-screen bg-base-200 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="sticky top-0 z-[100] bg-base-200/90 backdrop-blur p-4 border-b border-base-300">
                <div className="max-w-[2400px] mx-auto flex justify-between gap-4">
                    <input type="text" placeholder="🔍 Search..." className="input input-bordered w-full max-w-md shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <button onClick={() => setIsBlueprint(!isBlueprint)} className={`btn btn-sm ${isBlueprint ? 'btn-secondary' : 'btn-ghost border-base-300'}`}>
                        {isBlueprint ? "EXIT EDIT" : "⚙️ LAYOUT"}
                    </button>
                </div>
            </div>

            <main className="flex-grow p-2 pb-32 overflow-auto">
                <StoreMapCanvas cols={currentZone.cols} rows={20}>
                    <StoreGrid 
                        displays={displays} 
                        labels={labels} 
                        isBlueprint={isBlueprint} 
                        searchQuery={searchQuery} 
                        onAddItem={handleAddItem} 
                        onDeleteItem={handleDeleteItem} 
                        onSave={handleSave} 
                        onSelectDisplay={setSelectedDisplay} 
                        cols={currentZone.cols} 
                        rows={20} 
                    />
                </StoreMapCanvas>
            </main>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 z-[200] bg-base-100 border-t p-3">
                <div className="max-w-md mx-auto flex flex-col gap-2">
                    {isBlueprint && (
                        <div className="join self-center">
                            <button className={`btn btn-xs join-item ${placementMode === 'label' ? 'btn-primary' : ''}`} onClick={() => setPlacementMode('label')}>Label</button>
                            <button className={`btn btn-xs join-item ${placementMode === 'display' ? 'btn-primary' : ''}`} onClick={() => setPlacementMode('display')}>Display</button>
                        </div>
                    )}
                    <div className="flex overflow-x-auto gap-1 no-scrollbar">
                        {ZONES.map(z => (
                            <button key={z.id} onClick={() => setView(z.id)} className={`tab tab-md font-bold whitespace-nowrap ${view === z.id ? 'tab-active !bg-primary !text-white' : ''}`}>{z.label}</button>
                        ))}
                    </div>
                </div>
            </div>
            {selectedDisplay && <DisplayDetail display={selectedDisplay} onClose={() => setSelectedDisplay(null)} />}
        </div>
    );
};
export default Map;