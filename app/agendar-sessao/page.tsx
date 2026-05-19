import { ScheduleSessionPage } from "@/components/schedule-session-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar Sessão | Meet Off",
  description: "Agende sua sessão agora",
};

export default function Page() {
  return <ScheduleSessionPage />;
}
