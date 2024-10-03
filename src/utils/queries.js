import { useQuery } from "react-query";
import { recupererProduits } from "./hooks";

export function useProducts() {
  return useQuery({
    queryKey: ["dataKey"],
    queryFn: () => recupererProduits(),
  });
}
