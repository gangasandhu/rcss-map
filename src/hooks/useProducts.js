import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at")
      .then(({ data }) => {
        setProducts(data || []);
      });
  }, []);

  return products;
}
