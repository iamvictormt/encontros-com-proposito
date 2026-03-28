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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-1">
          {[
            { icon: User, label: "Perfil", active: true },
            { icon: Bell, label: "Notificações", active: false },
            { icon: Shield, label: "Segurança", active: false },
            { icon: Globe, label: "Geral", active: false },
            { icon: Mail, label: "Email", active: false },
          ].map((item, i) => (
            <Button
              key={i}
              variant="ghost"
              className={`w-full justify-start gap-3 font-bold ${item.active ? 'bg-white text-secondary shadow-sm' : 'text-muted-foreground'}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-bold text-secondary mb-4">Informações da Conta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue="Administrador Master" className="bg-gray-50/50 border-none shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="admin@encontroscomproposito.com.br" className="bg-gray-50/50 border-none shadow-sm" />
                </div>
              </div>
              <Button className="mt-6 bg-[#1f4c47] hover:bg-[#1a3d39] text-white">Salvar Alterações</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-bold text-secondary mb-4">Preferências do Sistema</h3>
              <div className="space-y-4">
                {[
                  { label: "Manutenção do site", desc: "Ativar modo de manutenção para usuários comuns.", checked: false },
                  { label: "Novos cadastros", desc: "Permitir que novos usuários se cadastrem no sistema.", checked: true },
                  { label: "Notificações push", desc: "Enviar alertas críticos para administradores.", checked: true },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-secondary">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.desc}</p>
                    </div>
                    <Switch checked={pref.checked} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden border-t-4 border-[#8a0204]">
            <CardContent className="p-6">
              <h3 className="font-bold text-secondary mb-2">Zona de Perigo</h3>
              <p className="text-xs text-muted-foreground mb-4">Ações irreversíveis para o banco de dados do sistema.</p>
              <div className="flex gap-4">
                <Button variant="outline" className="text-[#8a0204] border-[#8a0204] hover:bg-[#8a0204]/10 font-bold">Limpar Cache</Button>
                <Button variant="destructive" className="bg-[#8a0204] hover:bg-[#7a0204] text-white font-bold">Reiniciar Banco de Dados</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
