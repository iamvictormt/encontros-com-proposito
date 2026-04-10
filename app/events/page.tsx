import { EventsPage } from "@/components/events-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos | Meet Off",
  description: "Encontre os melhores eventos",
};

export default function Events() {
  return <EventsPage />;
}
