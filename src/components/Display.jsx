import React, { useState, useEffect } from "react";
import { uploadDisplayPhoto } from "../utils/uploadHandler";

const Display = ({ data, onSave, searchQuery, isBlueprint, onSelect }) => {
    const [uploading, setUploading] = useState(false);
    const [localName, setLocalName] = useState(data.manual_name || "");

    useEffect(() => { setLocalName(data.manual_name || ""); }, [data.manual_name]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const url = await uploadDisplayPhoto(data.id, file);
        if (url) onSave(data.id, { image_url: url, manual_name: localName });
        setUploading(false);
    };

    return (
        <div className={`flex flex-col w-full h-full bg-base-100 rounded-lg shadow-md border-2 transition-all ${searchQuery && localName.toLowerCase().includes(searchQuery.toLowerCase()) ? "ring-4 ring-yellow-400" : ""}`}>
            
            {/* Image Area */}
            <div 
                className="relative h-16 bg-base-300 rounded-t-md overflow-hidden cursor-pointer" 
                onClick={(e) => {
                    // Only trigger selection if we didn't click the snap button
                    if (!e.target.closest('label')) onSelect();
                }}
            >
                {data.image_url ? (
                    <img src={`${data.image_url}?v=${new Date(data.updated_at).getTime()}`} className="w-full h-full object-cover pointer-events-none" alt="" />
                ) : (
                    <div className="h-full flex items-center justify-center text-[10px] opacity-30 uppercase font-bold">No Photo</div>
                )}
                
                {isBlueprint && (
                    <label 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" 
                        onClick={e => e.stopPropagation()} 
                    >
                        <span className="text-[10px] text-white font-bold uppercase">Snap</span>
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                    </label>
                )}
                {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="loading loading-spinner loading-xs"></span></div>}
            </div>

            {/* Input Area */}
            <div className="p-1 bg-white rounded-b-md z-[50]">
                <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    // Save when the user clicks away or keyboard closes
                    onBlur={() => {
                        if (localName !== data.manual_name) {
                            onSave(data.id, { image_url: data.image_url, manual_name: localName });
                        }
                    }}
                    // Stop every event to prevent Grid interference
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="w-full text-center font-bold text-[11px] text-black bg-white outline-none border-none block"
                    placeholder="Set Name"
                    style={{ pointerEvents: 'auto', position: 'relative' }}
                />
            </div>
        </div>
    );
};
export default Display;