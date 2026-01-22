import React from "react";
import Display from "./Display";

const CompRailGrid = ({ displays, onSave }) => {
    return (
        <>
            {/* Minimalist Labels */}
            <div className="flex items-center justify-center text-base-content/20 font-black text-6xl"
                style={{ gridColumn: 1, gridRow: 1 }}>L</div>

            <div className="flex items-end text-[10px] font-bold uppercase tracking-widest text-base-content/40 border-b border-base-content/10"
                style={{ gridColumn: 4, gridRow: 2 }}>Dump Tables</div>

            <div className="flex items-end text-[10px] font-bold uppercase tracking-widest text-base-content/40 border-b border-base-content/10"
                style={{ gridColumn: 9, gridRow: 1 }}>Front Rail</div>

            <div className="rounded-xl border border-dashed border-base-content/5 bg-base-content/[0.02] flex items-center justify-center"
                style={{ gridColumn: "7 / span 2", gridRow: "8 / span 2" }}>
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-20">Four Block</span>
            </div>

            <div className="flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-20"
                style={{ gridColumn: 1, gridRow: "5 / span 4" }}>
                <span className="[writing-mode:vertical-lr] rotate-180">Left Rail</span>
            </div>

            {/* Displays */}
            {displays.map((slot) => (
                <div key={slot.id} style={{ gridColumn: slot.col, gridRow: slot.row }}>
                    <Display id={slot.id} productId={slot.product_id} onSave={onSave} />
                </div>
            ))}
        </>
    );
};

export default CompRailGrid;