import { useEffect, useState } from "react";
import ProductPicker from "./ProductPicker";
import useProducts from "../hooks/useProducts";

const Display = ({ id, productId, onSave }) => {
  const products = useProducts();
  const [open, setOpen] = useState(false);

//   useEffect(() => {
//     console.log(products)
//   }, [products])

  const product = products.find((p) => p.id === productId);

  return (
    <div className="w-full h-full bg-base-100 border rounded p-1 flex flex-col items-center justify-center">
      {product ? (
        <>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-10 h-10 object-contain"
          />
          <div className="text-xs text-center mt-1 truncate">
            {product.name}
          </div>
        </>
      ) : (
        <div className="text-xs opacity-40">Empty</div>
      )}

      <button
        className="btn btn-xs btn-ghost mt-1"
        onClick={() => setOpen(true)}
      >
        Change
      </button>
      {/* {open && <div>{products[0].name}</div>} */}
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
