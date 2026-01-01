import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchProducts() {
  const res = await axios.get("/api/product/get-all");
  return res.data.products;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
}
