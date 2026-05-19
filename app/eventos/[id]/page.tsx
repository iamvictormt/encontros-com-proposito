import { EventDetailPage } from "@/components/event-detail-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhe do Evento | Meet Off",
};

export default function EventDetail() {
  return <EventDetailPage />;
}
