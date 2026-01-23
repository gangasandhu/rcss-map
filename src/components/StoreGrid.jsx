import React from "react";
import Display from "./Display";

const StoreGrid = ({ 
    displays, 
    onSave, 
    isBlueprint, 
    onAddDisplay, 
    onDeleteDisplay,
    searchQuery, // Add this to pass search down
    rows = 20,
    cols = 40,
    zone 
}) => {
    // Coordinate lookup
    const displayMap = {};
    displays.forEach((d) => {
        displayMap[`${d.col}-${d.row}`] = d;
    });

    const handleCellClick = (col, row) => {
        if (!isBlueprint) return;
        const existing = displayMap[`${col}-${row}`];
        if (existing) return;

        const id = window.prompt(`New Display ID for ${zone}:`);
        if (id) {
            // Updated to match your new schema
            onAddDisplay({ 
                id, 
                col, 
                row, 
                zone, 
                image_url: null, 
                manual_name: "" 
            });
        }
    };

    return (
        <>
            {Array.from({ length: cols * rows }).map((_, i) => {
                const col = (i % cols) + 1;
                const row = Math.floor(i / cols) + 1;
                const slot = displayMap[`${col}-${row}`];

                if (!isBlueprint && !slot) return <div key={`${col}-${row}`} style={{ gridColumn: col, gridRow: row }} />;

                return (
                    <div
                        key={`${col}-${row}`}
                        style={{ gridColumn: col, gridRow: row }}
                        onClick={() => handleCellClick(col, row)}
                        className={`relative w-[130px] h-[110px] transition-all
                            ${isBlueprint && !slot ? "border border-dashed border-base-content/20 hover:bg-primary/5 cursor-crosshair group flex items-center justify-center" : ""}`}
                    >
                        {isBlueprint && !slot && (
                            <span className="opacity-0 group-hover:opacity-100 text-primary font-bold">+</span>
                        )}

                        {slot && (
                            <div className="w-full h-full p-1 relative">
                                {/* FIX: Pass the correct image and name props here */}
                                <Display
                                    id={slot.id}
                                    imageUrl={slot.image_url}   // New prop
                                    manualName={slot.manual_name} // New prop
                                    searchQuery={searchQuery}    // For highlighting
                                    onSave={onSave}
                                />
                                
                                {isBlueprint && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteDisplay(slot.id); }}
                                        className="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error z-50 shadow-sm"
                                    >✕</button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default StoreGrid;