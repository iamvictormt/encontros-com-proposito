import { ProductsPage } from "@/components/products-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos | Meet Off",
  description: "Encontre os melhores produtos com propósito",
};

export default function Page() {
  return <ProductsPage />;
}
