import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import StoreMapCanvas from "./MapCanvas";
import CompRailGrid from "./CompRailGrid";
import EndCapGrid from "./EndCapGrid"; // We will create this next

const Map = () => {
    const [displays, setDisplays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("comprail"); 

    // Fetch data whenever the view (tab) changes
    useEffect(() => {
        const getDisplays = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("displays")
                .select("*")
                // Fetching by the new 'zone' column we added
                .eq("zone", view === "comprail" ? "comp_rail" : "end_cap");

            if (!error) {
                setDisplays(data || []);
            }
            setLoading(false);
        };

        getDisplays();
    }, [view]);

    const handleSave = async (displayId, productId) => {
        // Optimistic Update: Update UI immediately for a snappy feel
        const previousDisplays = [...displays];
        setDisplays(prev => prev.map(d => d.id === displayId ? { ...d, product_id: productId } : d));

        const { error } = await supabase
            .from("displays")
            .update({ 
                product_id: productId, 
                updated_at: new Date() 
            })
            .eq("id", displayId);

        if (error) {
            // Rollback if database update fails
            setDisplays(previousDisplays);
            console.error("Error updating display:", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-2 md:p-4 pb-24">
            <div className="max-w-350 mx-auto">
                
                {/* Navigation Header */}
                <div className="flex justify-center items-center mb-6">
                    <div className="tabs tabs-boxed bg-base-100 p-1 shadow-sm border border-base-300">
                        <button 
                            className={`tab tab-md font-bold transition-all ${view === "comprail" ? "tab-active" : ""}`}
                            onClick={() => setView("comprail")}
                        >
                            Comp Rail
                        </button>
                        <button 
                            className={`tab tab-md font-bold transition-all ${view === "endcaps" ? "tab-active" : ""}`}
                            onClick={() => setView("endcaps")}
                        >
                            End Caps
                        </button>
                    </div>
                </div>

                {/* Shared Canvas Wrapper */}
                <StoreMapCanvas 
                    // Adjusted columns for End Caps to be narrower (3 columns is plenty for L/Aisle/R)
                    cols={view === "comprail" ? 10 : 3} 
                    rows={view === "comprail" ? 15 : 15}
                >
                    {loading ? (
                        <div className="col-span-full row-span-full flex items-center justify-center">
                            <span className="loading loading-spinner loading-lg text-primary opacity-20"></span>
                        </div>
                    ) : view === "comprail" ? (
                        <CompRailGrid 
                            displays={displays} 
                            onSave={handleSave} 
                        />
                    ) : (
                        <EndCapGrid 
                            displays={displays} 
                            onSave={handleSave} 
                        />
                    )}
                </StoreMapCanvas>
            </div>
        </div>
    );
};

export default Map;