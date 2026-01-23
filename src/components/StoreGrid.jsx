import React from "react";
import Display from "./Display";

const StoreGrid = ({ 
    displays, 
    products, 
    onSave, 
    isBlueprint, 
    onAddDisplay, 
    onDeleteDisplay,
    rows = 20,
    cols = 40,
    zone // passed down just for reference when adding new displays
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
            onAddDisplay({ id, col, row, zone, product_id: null });
        }
    };

    return (
        <>
            {/* Generate Grid Cells */}
            {Array.from({ length: cols * rows }).map((_, i) => {
                const col = (i % cols) + 1;
                const row = Math.floor(i / cols) + 1;
                const slot = displayMap[`${col}-${row}`];

                // If not blueprint and no display here, render nothing (invisible cell)
                if (!isBlueprint && !slot) return <div key={`${col}-${row}`} style={{ gridColumn: col, gridRow: row }} />;

                return (
                    <div
                        key={`${col}-${row}`}
                        style={{ gridColumn: col, gridRow: row }}
                        onClick={() => handleCellClick(col, row)}
                        className={`relative w-[130px] h-[110px] transition-all
                            ${isBlueprint && !slot ? "border border-base-content/5 hover:bg-primary/5 cursor-crosshair group flex items-center justify-center" : ""}`}
                    >
                        {isBlueprint && !slot && (
                            <span className="opacity-0 group-hover:opacity-100 text-primary font-bold">+</span>
                        )}

                        {slot && (
                            <div className="w-full h-full p-1 relative">
                                <Display
                                    id={slot.id}
                                    productId={slot.product_id}
                                    products={products}
                                    onSave={onSave}
                                />
                                {isBlueprint && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteDisplay(slot.id); }}
                                        className="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error z-50"
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