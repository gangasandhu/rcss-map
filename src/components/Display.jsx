import { useState } from "react";
import ProductPicker from "./ProductPicker";
import useProducts from "../hooks/useProducts";

const Display = ({ id, productId, onSave }) => {
    const products = useProducts();
    const [open, setOpen] = useState(false);
    const product = products.find((p) => p.id === productId);

    return (
        // 1. Used 'card' for elevation and 'aspect-square' for consistent sizing
        <div className={`card card-compact w-full h-full shadow-md transition-transform duration-200 hover:scale-105
  ${product ? "bg-base-100 border-none" : "bg-base-100/40 border-2 border-dashed border-base-content/10"}`}>

            <div className="card-body items-center text-center p-2 relative">
                {/* 2. Added a small ID badge in the corner */}
                <span className="absolute top-1 left-1 text-[10px] font-bold opacity-30 uppercase">{id}</span>

                {product ? (
                    <>
                        <div className="avatar mt-1">
                            <div className="w-12 h-12 rounded-lg bg-white p-1 shadow-inner border border-base-200">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        {/* 3. Improved typography with line-clamp */}
                        <h2 className="text-[11px] font-medium leading-tight line-clamp-2 mt-1 h-6">
                            {product.name}
                        </h2>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <div className="text-[10px] font-semibold tracking-widest opacity-40">EMPTY</div>
                    </div>
                )}

                {/* 4. Switched to an 'outline' or 'ghost' primary button */}
                <div className="card-actions w-full">
                    <button
                        className={`btn btn-xs btn-block ${product ? 'btn-ghost text-primary' : 'btn-outline btn-neutral'}`}
                        onClick={() => setOpen(true)}
                    >
                        {product ? "Edit" : "Assign"}
                    </button>
                </div>
            </div>

            {open && (
                <ProductPicker
                    products={products}
                    onClose={() => setOpen(false)}
                    onSelect={(p) => {
                        onSave(id, p.id);
                        setOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default Display;