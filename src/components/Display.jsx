import { useState } from "react";
import ProductPicker from "./ProductPicker";
import useProducts from "../hooks/useProducts";

const Display = ({ id, productId, onSave }) => {
    // Assuming your hook returns { products, loading }
    // If it only returns an array, you might need to check if products.length === 0
    const { products, loading } = useProducts(); 
    const [open, setOpen] = useState(false);
    
    const product = products?.find((p) => p.id === productId);

    return (
        <div className={`card card-compact w-full h-full shadow-md transition-transform duration-200 hover:scale-105
            ${product ? "bg-base-100 border-none" : "bg-base-100 border-2 border-dashed border-base-content/10"}`}>

            <div className="card-body items-center text-center p-2 relative">
                <span className="absolute top-1 left-1 text-[10px] font-bold opacity-30 uppercase">{id}</span>

                {loading ? (
                    /* --- LOADING STATE --- */
                    <div className="flex flex-1 items-center justify-center">
                        <span className="loading loading-spinner loading-sm text-primary/40"></span>
                    </div>
                ) : product ? (
                    /* --- PRODUCT ASSIGNED STATE --- */
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
                        <h2 className="text-[11px] font-medium leading-tight line-clamp-2 mt-1 h-6">
                            {product.name}
                        </h2>
                    </>
                ) : (
                    /* --- EMPTY STATE --- */
                    <div className="flex flex-col items-center justify-center flex-1">
                        <div className="text-[10px] font-semibold tracking-widest opacity-40">EMPTY</div>
                    </div>
                )}

                <div className="card-actions w-full mt-auto">
                    <button
                        disabled={loading}
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