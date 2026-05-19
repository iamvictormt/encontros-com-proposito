import { ProductDetailPage } from "@/components/product-detail-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhe do Produto | Meet Off",
};

export default function ProductDetail() {
  return <ProductDetailPage />;
}
