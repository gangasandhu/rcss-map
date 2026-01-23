import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StoreMapCanvas from "./MapCanvas";
import StoreGrid from "./StoreGrid";

const Map = () => {
    // State Management
    const [view, setView] = useState("comp_rail"); // 'comp_rail' or 'end_cap'
    const [isBlueprint, setIsBlueprint] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [displays, setDisplays] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch data based on the active zone
    useEffect(() => {
        const fetchDisplays = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("displays")
                .select("*")
                .eq("zone", view);

            if (!error) {
                setDisplays(data || []);
            }
            setLoading(false);
        };
        fetchDisplays();
    }, [view]);

    // 2. Handle Saves (Photos and Names)
    const handleSave = async (displayId, updates) => {
        // Optimistic UI update
        setDisplays(prev => prev.map(d => 
            d.id === displayId ? { ...d, ...updates } : d
        ));

        const { error } = await supabase
            .from("displays")
            .update({
                image_url: updates.image_url,
                manual_name: updates.manual_name,
                updated_at: new Date()
            })
            .eq("id", displayId);

        if (error) console.error("Database update failed:", error.message);
    };

    // 3. Blueprint: Add New Slot
    const handleAddDisplay = async (newDisplay) => {
        const { data, error } = await supabase
            .from("displays")
            .insert([newDisplay])
            .select();

        if (!error) {
            setDisplays(prev => [...prev, data[0]]);
        } else {
            alert("Error adding slot: " + error.message);
        }
    };

    // 4. Blueprint: Delete Slot
    const handleDeleteDisplay = async (displayId) => {
        if (!window.confirm("Delete this display location?")) return;

        const { error } = await supabase
            .from("displays")
            .delete()
            .eq("id", displayId);

        if (!error) {
            setDisplays(prev => prev.filter(d => d.id !== displayId));
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-2 md:p-4 pb-24">
            <div className="max-w-[2400px] mx-auto">
                
                {/* TOP CONTROL BAR */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sticky top-0 z-[100] bg-base-200/80 backdrop-blur pb-4">
                    
                    {/* Zone Selector */}
                    <div className="tabs tabs-boxed bg-base-100 p-1 border border-base-300 shadow-sm">
                        <button 
                            className={`tab tab-md font-bold ${view === 'comp_rail' ? 'tab-active' : ''}`}
                            onClick={() => setView('comp_rail')}
                        >
                            Comp Rail
                        </button>
                        <button 
                            className={`tab tab-md font-bold ${view === 'end_cap' ? 'tab-active' : ''}`}
                            onClick={() => setView('end_cap')}
                        >
                            End Caps
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-md">
                        <input 
                            type="text"
                            placeholder="🔍 Search items (e.g. 'Oreo', 'Coke')..."
                            className="input input-bordered w-full shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-3 btn btn-circle btn-xs"
                            >✕</button>
                        )}
                    </div>

                    {/* Blueprint Toggle */}
                    <button 
                        onClick={() => setIsBlueprint(!isBlueprint)}
                        className={`btn btn-md gap-2 shadow-md transition-all ${
                            isBlueprint ? 'btn-secondary' : 'btn-ghost bg-base-100 border-base-300'
                        }`}
                    >
                        {isBlueprint ? "EXIT EDIT MODE" : "⚙️ EDIT LAYOUT"}
                    </button>
                </div>

                {/* THE GRID CANVAS */}
                <StoreMapCanvas 
                    cols={view === 'comp_rail' ? 12 : 42} 
                    rows={20}
                >
                    {loading ? (
                        <div className="col-span-full row-span-full flex flex-col items-center justify-center min-h-[400px]">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : (
                        <StoreGrid 
                            zone={view}
                            displays={displays}
                            searchQuery={searchQuery} // Pass search down to highlight items
                            isBlueprint={isBlueprint}
                            onSave={handleSave}
                            onAddDisplay={handleAddDisplay}
                            onDeleteDisplay={handleDeleteDisplay}
                            cols={view === 'comp_rail' ? 12 : 42}
                            rows={20}
                        />
                    )}
                </StoreMapCanvas>

            </div>
        </div>
    );
};

export default Map;