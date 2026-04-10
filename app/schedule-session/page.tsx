import { ScheduleSessionPage } from "@/components/schedule-session-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar Sessão | Encontros com Propósito",
  description: "Agende sua sessão agora",
};

export default function Page() {
  return <ScheduleSessionPage />;
}
