import React from "react";

const DisplayDetail = ({ display, onClose }) => {
    if (!display) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Detail Card */}
            <div className="relative bg-base-100 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost bg-black/20 text-white z-10"
                >✕</button>

                {/* Full Image */}
                <div className="w-full aspect-square bg-base-300">
                    {display.image_url ? (
                        <img 
                            src={`${display.image_url}?v=${new Date(display.updated_at).getTime()}`} 
                            className="w-full h-full object-contain"
                            alt={display.manual_name}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-5xl">🖼️</div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4">
                    <div>
                        <h2 className="text-3xl font-black text-base-content leading-tight">
                            {display.manual_name || "Unnamed Display"}
                        </h2>
                        <p className="text-sm opacity-50 font-mono mt-1">
                            Slot: {display.col}-{display.row} | Zone: {display.zone.toUpperCase()}
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-base-300">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold opacity-40">Last Updated</span>
                            <span className="text-sm font-medium">
                                {new Date(display.updated_at).toLocaleString([], { 
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayDetail;