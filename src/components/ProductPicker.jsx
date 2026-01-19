import { useState } from "react";

const ProductPicker = ({ products, onSelect, onClose }) => {
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-100 w-full max-w-md rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Select Product</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search product..."
          className="input input-bordered w-full mb-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="max-h-80 overflow-y-auto space-y-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="flex items-center gap-3 w-full p-2 rounded hover:bg-base-200 text-left"
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-10 h-10 object-contain bg-base-200 rounded"
              />
              <span className="text-sm">{p.name}</span>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-sm opacity-60 text-center py-4">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
