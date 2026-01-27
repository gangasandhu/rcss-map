import React from "react";
import Display from "./Display";

// Inside StoreGrid.js - Update your rendering logic:
const StoreGrid = ({ displays, labels, onAddItem, onDeleteItem, ...props }) => {
    const itemMap = {};
    displays.forEach(d => itemMap[`${d.col}-${d.row}`] = { ...d, type: 'display' });
    labels.forEach(l => itemMap[`${l.col}-${l.row}`] = { ...l, type: 'label' });

    return (
        <>
            {Array.from({ length: props.cols * props.rows }).map((_, i) => {
                const col = (i % props.cols) + 1;
                const row = Math.floor(i / props.cols) + 1;
                const slot = itemMap[`${col}-${row}`];

                return (
                    <div 
                        key={i} 
                        style={{ gridColumn: col, gridRow: row }}
                        onClick={() => !slot && props.isBlueprint && onAddItem(col, row)}
                        className={`relative w-[130px] h-[110px] ${props.isBlueprint && !slot ? 'border border-dashed' : ''}`}
                    >
                        {slot?.type === 'display' && (
                            <div className="w-full h-full p-1 relative">
                                <Display id={slot.id} imageUrl={slot.image_url} manualName={slot.manual_name} onSave={props.onSave} searchQuery={props.searchQuery} />
                                {props.isBlueprint && <button onClick={() => onDeleteItem(slot.id, 'display')} className="btn btn-circle btn-xs btn-error absolute -top-1 -right-1 z-10">✕</button>}
                            </div>
                        )}

                        {slot?.type === 'label' && (
                            <div className="w-full h-full flex items-center justify-center p-2 relative">
                                <span className="text-sm font-black text-base-content/50 uppercase tracking-widest text-center leading-tight">
                                    {slot.text}
                                </span>
                                {props.isBlueprint && <button onClick={() => onDeleteItem(slot.id, 'label')} className="btn btn-circle btn-xs btn-error absolute top-0 right-0">✕</button>}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default StoreGrid;