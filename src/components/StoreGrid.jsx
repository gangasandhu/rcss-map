import React from "react";
import Display from "./Display";

const StoreGrid = ({ displays, labels, onAddItem, onDeleteItem, onSelectDisplay, ...props }) => {
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
                        onClick={(e) => {
                            // GUARD: If we clicked an input or button inside, STOP the grid action
                            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                            
                            if (props.isBlueprint && !slot) {
                                onAddItem(col, row);
                            } else if (!props.isBlueprint && slot?.type === 'display') {
                                onSelectDisplay(slot);
                            }
                        }}
                        className={`relative w-[130px] h-[110px] ${props.isBlueprint && !slot ? 'border border-dashed border-base-300' : ''}`}
                    >
                        {slot?.type === 'display' && (
                            <div className="w-full h-full p-1 relative z-20">
                                <Display 
                                    data={slot} 
                                    onSave={props.onSave} 
                                    searchQuery={props.searchQuery} 
                                    isBlueprint={props.isBlueprint} 
                                    onSelect={() => onSelectDisplay(slot)}
                                />
                                {props.isBlueprint && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteItem(slot.id, 'display'); }} 
                                        className="btn btn-circle btn-xs btn-error absolute -top-1 -right-1 z-30 shadow-md"
                                    >✕</button>
                                )}
                            </div>
                        )}
                        {slot?.type === 'label' && (
                            <div className="w-full h-full flex items-center justify-center relative">
                                <span className="text-xs font-bold opacity-40 uppercase">{slot.text}</span>
                                {props.isBlueprint && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteItem(slot.id, 'label'); }} 
                                        className="btn btn-circle btn-xs btn-error absolute top-0 right-0 z-30"
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