import { useState } from "react";
import ProductPicker from "./ProductPicker";
import useProducts from "../hooks/useProducts";
import { memo } from "react";

const Display = memo(({ id, productId, onSave, products, loading }) => {
    const [open, setOpen] = useState(false);
    
    const product = products?.find((p) => p.id === productId);

    return (
        <div className={`card card-compact w-full h-full shadow-sm transition-all border
            ${product 
                ? "bg-base-100 border-base-300" 
                : "bg-base-100/30 border-dashed border-base-content/10"}`}>

            <div className="card-body p-2 flex flex-col justify-between items-center relative min-h-[110px]">
                {/* ID Label - Small and tucked in the corner */}
                <span className="absolute top-1 left-1 text-[9px] font-black opacity-30 uppercase">
                    {id}
                </span>

                <div className="flex flex-col items-center justify-center flex-1 w-full text-center mt-2">
                    {loading ? (
                        <span className="loading loading-spinner loading-xs opacity-20"></span>
                    ) : product ? (
                        <div className="flex flex-col gap-1 w-full">
                            {/* Product Name - Strong and Clear */}
                            <h2 className="text-[11px] font-bold leading-tight line-clamp-3 text-base-content uppercase tracking-tight">
                                {product.name}
                            </h2>
                           
                        </div>
                    ) : (
                        <div className="text-[10px] font-bold opacity-10 tracking-widest">EMPTY</div>
                    )}
                </div>

                <div className="card-actions w-full">
                    <button
                        disabled={loading}
                        className={`btn btn-xs btn-block border-none shadow-none font-bold
                            ${product ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-base-200 text-base-content/40'}`}
                        onClick={() => setOpen(true)}
                    >
                        {product ? "CHANGE" : "ASSIGN"}
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
});

export default Display;