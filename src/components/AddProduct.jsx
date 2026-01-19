import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddProduct({ onAdded }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name || !imageUrl) return;

    setLoading(true);

    const { error } = await supabase
      .from("products")
      .insert([{ name, image_url: imageUrl }]);

    setLoading(false);

    if (!error) {
      setName("");
      setImageUrl("");
      onAdded?.(); // refetch products
    } else {
      console.error(error);
    }
  };

  return (
    <div className="card bg-base-100 p-4 m-4 gap-3 h-screen md:w-[60vw] flex items-center mx-auto">
      <input
        className="input input-bordered"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="input input-bordered"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button
        className="btn btn-primary"
        onClick={handleAdd}
        disabled={loading}
      >
        Add product
      </button>
    </div>
  );
}
