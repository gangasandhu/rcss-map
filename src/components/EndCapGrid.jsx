import React from "react";
import Display from "./Display";

const EndCapGrid = ({ displays, onSave }) => {
    const aisleNumbers = Array.from({ length: 13 }, (_, i) => 13 - i);

    return (
        <>
            {/* 1. Axis Labels */}
            <div className="flex items-center justify-end pr-4 text-[10px] font-black opacity-30" style={{ gridColumn: 1, gridRow: 1 }}>FRONT</div>
            <div className="flex items-center justify-end pr-4 text-[10px] font-black opacity-30" style={{ gridColumn: 1, gridRow: 5 }}>BACK</div>

            {/* 2. Aisle Group Backgrounds & Numbers */}
            {aisleNumbers.map((num, index) => {
                const startCol = (index * 3) + 2;
                const isEven = num % 2 === 0;

                return (
                    <React.Fragment key={`aisle-group-${num}`}>
                        {/* Background Panel for the whole Aisle Cluster */}
                        <div 
                            className="rounded-2xl p-4 border-4 border-dotted border-accent-content/50  shadow-inner transition-colors bg-gray-200"
                            style={{ 
                                gridColumn: `${startCol} / span 3`, 
                                gridRow: "1 / span 5",
                                zIndex: 0 
                            }}
                        />

                        {/* Large Aisle Number in the center */}
                        <div 
                            className="flex items-center justify-center font-black text-5xl opacity-10 italic pointer-events-none select-none"
                            style={{ 
                                gridColumn: `${startCol} / span 3`, 
                                gridRow: 3,
                                zIndex: 1 
                            }}
                        >
                            {num}
                        </div>
                    </React.Fragment>
                );
            })}

            {/* 3. The Displays (Ensured z-index sits above backgrounds) */}
            {displays.map((slot) => {
                const isMain = slot.id.includes('-M');
                
                return (
                    <div
                        key={slot.id}
                        className={`relative z-10 transition-all ${isMain ? "w-full scale-100" : "px-3 scale-95 opacity-90"}`}
                        style={{
                            gridColumn: slot.col,
                            gridRow: slot.row,
                        }}
                    >
                        <Display
                            id={slot.id}
                            productId={slot.product_id}
                            onSave={onSave}
                            // You can pass a prop to Display to handle the "Profit Panel" look
                            isSideRack={!isMain}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default EndCapGrid;