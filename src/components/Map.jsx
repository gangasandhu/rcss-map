import React, { useEffect, useState } from "react";
import Display from "./Display";
import { supabase } from "../supabaseClient";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Map = () => {
    const [displays, setDisplays] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define the map bounds (adjust based on your JSON max row/col)
    const MAX_COLS = 10;
    const MAX_ROWS = 15;

    useEffect(() => {
        getDisplays();
    }, []);

    async function getDisplays() {
        try {
            const { data } = await supabase.from("displays").select();
            setDisplays(data || []);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (displayId, productId) => {
        const { error } = await supabase
            .from("displays")
            .update({ product_id: productId, updated_at: new Date() })
            .eq("id", displayId);

        if (!error) {
            setDisplays((prev) =>
                prev.map((d) => d.id === displayId ? { ...d, product_id: productId } : d)
            );
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="max-w-350 mx-auto">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-black">Floor Manager</h1>
                        <p className="text-xs opacity-50 uppercase tracking-widest">Storefront Layout</p>
                    </div>
                </div>

                {/* The Map Canvas */}
                <div className="overflow-auto rounded-xl border border-base-300 bg-base-300 shadow-inner">
                    <div className="relative overflow-hidden border border-base-300 rounded-xl bg-base-300 shadow-inner h-[80vh]">
                        <TransformWrapper
                            initialScale={0.5}
                            minScale={0.2}
                            maxScale={2}
                            // centerOnInit={true}
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    {/* Floating Controls for better UX */}
                                    <div className="absolute bottom-4 right-4 z-50 flex gap-2">
                                        <button className="btn btn-circle btn-sm btn-primary" onClick={() => zoomIn()}>+</button>
                                        <button className="btn btn-circle btn-sm btn-primary" onClick={() => zoomOut()}>-</button>
                                        <button className="btn btn-circle btn-sm btn-ghost bg-base-100" onClick={() => resetTransform()}>Reset</button>
                                    </div>

                                    {/* The actual Zoomable Area */}
                                    <TransformComponent
                                        wrapperStyle={{ width: "100%", height: "100%" }}
                                        contentStyle={{ padding: "40px" }}
                                    >
                                        <div
                                            className="grid p-8 gap-3 bg-grid-dots" // Increased gap slightly
                                            style={{
                                                gridTemplateColumns: `repeat(${MAX_COLS}, 130px)`, // Fixed width is safer for alignment
                                                gridTemplateRows: `repeat(${MAX_ROWS}, 130px)`,
                                                width: 'max-content'
                                            }}
                                        >
                                            {/* Static Labels - Minimalist & Aligned */}

                                            {/* L - Minimal corner indicator */}
                                            <div className="flex items-center justify-center text-base-content/20 font-black text-6xl"
                                                style={{ gridColumn: 1, gridRow: 1 }}>
                                                L
                                            </div>

                                            {/* Dump Tables - Simple underline aligned to the grid cell */}
                                            <div className="flex items-end text-[10px] font-bold uppercase tracking-widest text-base-content/40 border-b border-base-content/10"
                                                style={{ gridColumn: 4, gridRow: 2 }}>
                                                Dump Tables
                                            </div>

                                            {/* Front Rail - Simple underline aligned to the grid cell */}
                                            <div className="flex items-end text-[10px] font-bold uppercase tracking-widest text-base-content/40 border-b border-base-content/10"
                                                style={{ gridColumn: 9, gridRow: 1 }}>
                                                Front Rail
                                            </div>

                                            {/* Four Block - Subtle background area that doesn't move cards */}
                                            <div className="rounded-xl border border-dashed border-base-content/5 bg-base-content/[0.02] flex items-center justify-center"
                                                style={{
                                                    gridColumn: "7 / span 2",
                                                    gridRow: "8 / span 2"
                                                }}>
                                                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-20">Four Block</span>
                                            </div>

                                            {/* Left Rail - Vertical text tucked into the first column */}
                                            <div className="flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-20"
                                                style={{ gridColumn: 1, gridRow: "5 / span 4" }}>
                                                <span className="[writing-mode:vertical-lr] rotate-180">Left Rail</span>
                                            </div>

                                            {/* Automated Slot Placement */}
                                            {displays.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className="w-full h-full"
                                                    style={{
                                                        gridColumn: slot.col,
                                                        gridRow: slot.row
                                                    }}
                                                >
                                                    <Display
                                                        id={slot.id}
                                                        productId={slot.product_id}
                                                        onSave={handleSave}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Map;