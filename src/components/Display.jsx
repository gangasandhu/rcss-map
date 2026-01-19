import React, { useState } from "react";

const Display = ({ id, productName, image, onSave }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(productName || "");
    const [img, setImg] = useState(image || "");

    const save = () => {
        setEditing(false);
        onSave(id, name.trim(), img.trim());
    };

    return (
        <div className="w-full h-full border border-base-300 rounded bg-base-100 shadow-sm flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-6 bg-base-200 text-[10px] px-1 flex items-center truncate">
                {editing ? (
                    <input
                        className="input input-xs w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Product name"
                    />
                ) : (
                    <span
                        className="cursor-pointer truncate"
                        onClick={() => setEditing(true)}
                    >
                        {productName || "Empty"}
                    </span>
                )}
            </div>

            {/* Image */}
            <div
                className="flex-1 bg-base-100 flex items-center justify-center cursor-pointer"
                onClick={() => setEditing(true)}
            >
                {img ? (
                    <img
                        src={img}
                        alt={name}
                        className="
                                w-10
                                h-10
                                object-contain
                                p-1
                            "
                    />

                ) : (
                    <span className="text-[10px] text-base-content/40">
                        No image
                    </span>
                )}
            </div>

            {/* Image URL input (edit mode only) */}
            {editing && (
                <div className="p-1 border-t border-base-300">
                    <input
                        className="input input-xs w-full"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                        placeholder="Image URL"
                        onBlur={save}
                        onKeyDown={(e) => e.key === "Enter" && save()}
                    />
                </div>
            )}
        </div>
    );
};

export default Display;
