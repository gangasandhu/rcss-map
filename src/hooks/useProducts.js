import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // We only select the columns we actually need for the list
        const { data, error } = await supabase
          .from("products")
          .select("id, name") 
          .order("name"); // Alphabetical is easier for data entry

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading };
}