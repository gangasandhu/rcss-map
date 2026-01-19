
import { useEffect, useState } from "react";

const SHEET_URL = import.meta.env.VITE_PRODUCTS_SHEET_URL
  

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch(console.error);
  }, []);

  return products;
}
