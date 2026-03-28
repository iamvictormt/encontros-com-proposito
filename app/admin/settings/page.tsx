import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Globe, Mail } from "lucide-react"

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <h2 className="text-xl font-bold text-secondary uppercase tracking-tight">Configurações</h2>
    </div>
  )
}
