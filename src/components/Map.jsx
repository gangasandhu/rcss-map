import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StoreMapCanvas from "./MapCanvas";
import StoreGrid from "./StoreGrid";

const Map = () => {
    const ZONES = [
        { id: "comp_rail", label: "Comp Rail", cols: 12 },
        { id: "end_cap", label: "End Caps", cols: 42 },
        { id: "dairy", label: "Dairy", cols: 24 },
        { id: "meat", label: "Meat", cols: 20 },
        { id: "deli", label: "Deli", cols: 15 },
    ];

    const [view, setView] = useState("comp_rail");
    const [isBlueprint, setIsBlueprint] = useState(false);
    const [placementMode, setPlacementMode] = useState("label");
    const [searchQuery, setSearchQuery] = useState("");
    const [displays, setDisplays] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get current zone config
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

    // 2. Handle Saves (Displays)
    const handleSave = async (displayId, updates) => {
        setDisplays(prev => prev.map(d => d.id === displayId ? { ...d, ...updates } : d));
        await supabase.from("displays").update({ ...updates, updated_at: new Date() }).eq("id", displayId);
    };

    // 3. Blueprint: Add Logic
    const handleAddItem = async (col, row) => {
        if (placementMode === "display") {
            // Supabase will generate the 8-char random ID.
            const newDisp = {
                col,
                row,
                zone: view,
                manual_name: ""
            };

            const { data, error } = await supabase
                .from("displays")
                .insert([newDisp])
                .select();

            if (error) {
                console.error("Insert error:", error.message);
            } else {
                setDisplays(prev => [...prev, data[0]]);
            }
        } else {
            // Labels still need text because they are markers
            const text = window.prompt("Label Text:");
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
        <div className="min-h-screen bg-base-200 flex flex-col">

            {/* TOP BAR: Search and Edit Mode only */}
            <div className="sticky top-0 z-[100] bg-base-200/90 backdrop-blur p-4 border-b border-base-300">
                <div className="max-w-[2400px] mx-auto flex justify-between items-center gap-4">

                    {/* Search Bar */}
                    <div className="relative flex-grow max-w-md">
                        <input
                            type="text"
                            placeholder="🔍 Search items..."
                            className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Blueprint Settings */}
                    <div className="flex items-center gap-2">
                        {isBlueprint && (
                            <select
                                className="select select-bordered select-sm font-bold text-primary hidden md:block"
                                value={placementMode}
                                onChange={(e) => setPlacementMode(e.target.value)}
                            >
                                <option value="label">Mode: Label</option>
                                <option value="display">Mode: Display</option>
                            </select>
                        )}
                        <button
                            onClick={() => setIsBlueprint(!isBlueprint)}
                            className={`btn btn-sm shadow-sm ${isBlueprint ? 'btn-secondary' : 'btn-ghost bg-base-100 border-base-300'}`}
                        >
                            {isBlueprint ? "EXIT" : "⚙️ LAYOUT"}
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CANVAS AREA */}
            <main className="flex-grow p-2 pb-32"> {/* Extra padding bottom for the nav bar */}
                <div className="max-w-[2400px] mx-auto">
                    <StoreMapCanvas cols={currentZone.cols} rows={20}>
                        <StoreGrid
                            zone={view}
                            displays={displays}
                            labels={labels}
                            searchQuery={searchQuery}
                            isBlueprint={isBlueprint}
                            onSave={handleSave}
                            onAddItem={handleAddItem}
                            onDeleteItem={handleDeleteItem}
                            cols={currentZone.cols}
                            rows={20}
                        />
                    </StoreMapCanvas>
                </div>
            </main>

            {/* BOTTOM NAVIGATION BAR (The Zone Bar) */}
            <div className="fixed bottom-0 left-0 right-0 z-[200] bg-base-100 border-t border-base-300 px-2 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="max-w-md mx-auto">

                    {/* Floating Placement Mode for Mobile Edit Mode */}
                    {isBlueprint && (
                        <div className="flex justify-center mb-3 md:hidden">
                            <div className="join border border-base-300 shadow-sm">
                                <button
                                    className={`join-item btn btn-xs ${placementMode === 'label' ? 'btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setPlacementMode('label')}
                                >Label</button>
                                <button
                                    className={`join-item btn btn-xs ${placementMode === 'display' ? 'btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setPlacementMode('display')}
                                >Display</button>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Zone Tabs */}
                    <div className="flex overflow-x-auto no-scrollbar justify-center">
                        <div className="tabs tabs-boxed bg-transparent p-0 flex-nowrap gap-1">
                            {ZONES.map((zone) => (
                                <button
                                    key={zone.id}
                                    className={`tab tab-md font-bold transition-all ${view === zone.id ? 'tab-active !bg-primary !text-white' : 'opacity-60'}`}
                                    onClick={() => setView(zone.id)}
                                >
                                    {zone.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;