import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // 1. Default to true

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at");

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false); // 2. Turn off spinner regardless of success/fail
      }
    }

    fetchProducts();
  }, []);

  // 3. Return an object instead of just the array
  return { products, loading };
}