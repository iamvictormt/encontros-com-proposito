import { InvitePage } from "@/components/invite-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convite - Encontros com Propósito",
  description: "Gere seu token exclusivo para convidar amigos.",
};

export default function Page() {
  return <InvitePage />;
}
