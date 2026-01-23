import React, { useState, useEffect } from "react";
import { uploadDisplayPhoto } from "../utils/uploadHandler";

const Display = ({ id, imageUrl, manualName, onSave, searchQuery }) => {
    const [uploading, setUploading] = useState(false);
    // 1. Create local state for the input so it's "live"
    const [localName, setLocalName] = useState(manualName || "");

    // Update local state if the database version changes (e.g., after a fresh fetch)
    useEffect(() => {
        setLocalName(manualName || "");
    }, [manualName]);

    const isMatch = searchQuery && localName?.toLowerCase().includes(searchQuery.toLowerCase());
    const isDimmed = searchQuery && !isMatch;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const publicUrl = await uploadDisplayPhoto(id, file);
        if (publicUrl) {
            onSave(id, { image_url: publicUrl, manual_name: localName });
        }
        setUploading(false);
    };

    // 2. Save to database only when the user stops typing (onBlur) 
    // or presses Enter to save battery/API calls
    const handleBlur = () => {
        if (localName !== manualName) {
            onSave(id, { image_url: imageUrl, manual_name: localName });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur(); // Trigger handleBlur
        }
    };

    return (
        <div className={`
        group relative flex flex-col w-full h-full bg-base-100 rounded-lg shadow-md border-2 transition-all
        ${isMatch ? "ring-4 ring-yellow-400 z-[50]" : "z-[10]"}
        ${isDimmed ? "opacity-30 grayscale" : "opacity-100"}
    `}>

            {/* IMAGE SECTION */}
            <div className="relative h-16 bg-base-300 overflow-hidden rounded-t-md">
                {imageUrl ? (
                    <img src={imageUrl} className="w-full h-full object-cover" />
                ) : (
                    <div className="h-full flex items-center justify-center opacity-20 text-xs">NO PHOTO</div>
                )}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-[10px] font-bold">CHANGE</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                </label>
            </div>

            {/* INPUT SECTION - THE FIX IS HERE */}
            <div className="p-1 bg-white relative" style={{ zIndex: 100 }}>
                <input
                    type="text"
                    placeholder="Set Name..."
                    value={localName}
                    /* These three lines are the magic "unblockers" */
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}

                    onChange={(e) => setLocalName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="input input-ghost input-xs w-full text-center font-bold p-0 h-auto min-h-0 text-[11px] focus:outline-none focus:bg-blue-50 text-black border-none"
                    style={{
                        pointerEvents: 'auto', // Force clickability
                        position: 'relative',
                        zIndex: 101
                    }}
                />
                <div className="text-[8px] opacity-30 text-center font-mono uppercase">{id}</div>
            </div>
        </div>
    );
};

export default Display;