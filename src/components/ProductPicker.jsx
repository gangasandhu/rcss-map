import { useState } from "react";
import { createPortal } from "react-dom";

const ProductPicker = ({ products, onSelect, onClose }) => {
    const [query, setQuery] = useState("");

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    return createPortal(
        <div
            data-theme="light"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={onClose}
        >
            <div
                className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Select Product</h3>
                    <button className="btn btn-circle btn-sm btn-ghost" onClick={onClose}>✕</button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input input-bordered w-full bg-slate-50 text-slate-800"
                        value={query}
                        autoFocus
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="overflow-y-auto pr-1 flex-1 space-y-1">
                    {/* --- REMOVE / EMPTY ACTION --- */}
                    {!query && (
                        <button
                            onClick={() => onSelect({ id: null, name: "" })}
                            className="flex items-center gap-4 w-full p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-error hover:bg-error/5 text-error transition-all mb-4 group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-error/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm">Clear Display (Set to Empty)</span>
                        </button>
                    )}

                    {/* Product List */}
                    {filtered.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p)}
                            className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-slate-100 transition-colors text-left text-slate-800"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 shrink-0">
                                <img
                                    src={p.image_url}
                                    alt={p.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-medium text-sm line-clamp-1">{p.name}</span>
                        </button>
                    ))}

                    {filtered.length === 0 && query && (
                        <div className="text-sm opacity-60 text-center py-10 text-slate-500">
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProductPicker;