import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StoreMapCanvas from "./MapCanvas";
import StoreGrid from "./StoreGrid";
import useProducts from "../hooks/useProducts";

const Map = () => {
    // 1. Unified State
    const [view, setView] = useState("comp_rail"); // Matches DB 'zone' values
    const [isBlueprint, setIsBlueprint] = useState(false);
    const [displays, setDisplays] = useState([]);
    const [loading, setLoading] = useState(false);
    const { products, loading: productsLoading } = useProducts();

    // 2. Fetch displays whenever the view changes
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

    // 3. Handle Product Assignment
    const handleSave = async (displayId, productId) => {
        const previousDisplays = [...displays];
        setDisplays(prev => prev.map(d => d.id === displayId ? { ...d, product_id: productId } : d));

        const { error } = await supabase
            .from("displays")
            .update({ product_id: productId, updated_at: new Date() })
            .eq("id", displayId);

        if (error) {
            setDisplays(previousDisplays);
            console.error("Update failed:", error.message);
        }
    };

    // 4. Handle Layout Changes (Blueprint Mode)
    const handleAddDisplay = async (newDisplay) => {
        const { data, error } = await supabase
            .from("displays")
            .insert([newDisplay])
            .select();

        if (!error) {
            setDisplays(prev => [...prev, data[0]]);
        } else {
            alert("Error: " + error.message);
        }
    };

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
        <div className="min-h-screen bg-base-200 p-4 pb-24">
            <div className="max-w-[2400px] mx-auto">
                
                {/* NAVIGATION BAR */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
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

                    <div className="divider divider-horizontal mx-0"></div>

                    {/* BLUEPRINT TOGGLE */}
                    <button 
                        onClick={() => setIsBlueprint(!isBlueprint)}
                        className={`btn btn-md gap-2 shadow-md transition-all ${
                            isBlueprint ? 'btn-secondary' : 'btn-ghost bg-base-100 border-base-300'
                        }`}
                    >
                        {isBlueprint ? (
                            <><span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> EXIT BLUEPRINT</>
                        ) : (
                            "⚙️ EDIT LAYOUT"
                        )}
                    </button>
                </div>

                {/* THE MAP CANVAS */}
                <StoreMapCanvas 
                    cols={view === 'comp_rail' ? 12 : 42} 
                    rows={20}
                >
                    {loading || productsLoading ? (
                        <div className="col-span-full row-span-full flex flex-col items-center justify-center min-h-[300px] gap-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-xs font-black opacity-30 uppercase tracking-widest">Loading Store Data...</p>
                        </div>
                    ) : (
                        <StoreGrid 
                            zone={view}
                            displays={displays}
                            products={products}
                            isBlueprint={isBlueprint}
                            onSave={handleSave}
                            onAddDisplay={handleAddDisplay}
                            onDeleteDisplay={handleDeleteDisplay}
                            // Grid logic
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