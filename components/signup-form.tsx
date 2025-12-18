"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
 import { APIError } from "@/lib/services/api-client"
import { formatCPF, unformatCPF, validateCPF, validateEmail, detectInputType } from "@/lib/utils/validators"
import { Logo } from "./logo"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/services/auth.service"

export function SignupForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [year, setYear] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailCpfError, setEmailCpfError] = useState("")
  const { isLoggedIn, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showIntro, setShowIntro] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString()
    setYear(currentYear)

    if (!authLoading && isLoggedIn) {
      router.push("/events")
    }
  }, [authLoading, isLoggedIn, router])

  useEffect(() => {
    setMounted(true)
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation')
    if (!hasSeenAnimation) {
      setShowIntro(true)
    }
  }, [])

  const handleEmailCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const inputType = detectInputType(value)

    if (inputType === "cpf") {
      const formatted = formatCPF(value)
      setEmail(formatted)
      setEmailCpfError("")
    } else if (inputType === "email") {
      setEmail(value)
      setEmailCpfError("")
    } else {
      setEmail(value)
    }
  }

  const handleEmailCpfBlur = () => {
    if (!email) return

    const inputType = detectInputType(email)

    if (inputType === "cpf") {
      const cpfNumbers = unformatCPF(email)
      if (cpfNumbers.length === 11 && !validateCPF(email)) {
        setEmailCpfError("CPF inválido")
      } else if (cpfNumbers.length > 0 && cpfNumbers.length < 11) {
        setEmailCpfError("CPF incompleto")
      } else {
        setEmailCpfError("")
      }
    } else if (inputType === "email") {
      if (!validateEmail(email)) {
        setEmailCpfError("Email inválido")
      } else {
        setEmailCpfError("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (emailCpfError) {
      toast({
        variant: "error",
        title: "Erro de validação",
        description: emailCpfError,
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        variant: "error",
        title: "Erro de validação",
        description: "As senhas não coincidem",
      })
      return
    }

    setIsLoading(true)

    try {
      const isEmail = email.includes("@")

      await authService.register({
        fullName,
        ...(isEmail ? { email } : { cpf: unformatCPF(email) }),
        password,
      })

      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado.",
      })

      router.push("/events")
    } catch (err) {
      if (err instanceof APIError) {
        toast({
          variant: "error",
          title: "Erro ao criar conta",
          description: err.message,
        })
      } else {
        toast({
          variant: "error",
          title: "Erro ao conectar",
          description: "Erro ao conectar com o servidor",
        })
      }
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {mounted && showIntro && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-1000 opacity-100">
          <video
            src="/videos/meet-off-animation-logo.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => {
              sessionStorage.setItem('hasSeenAnimation', 'true');
              setShowIntro(false);
            }}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-8 md:p-12 lg:p-16 lg:relative">
        <div className="lg:absolute lg:top-6 lg:left-20 mb-8 lg:mb-0">
          <Logo className="justify-center flex md:block" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6 sm:space-y-10">
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-5 text-center mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">{"Criar uma nova conta"}</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {"Vamos começar com alguns fatos sobre você"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                    {"Nome completo"}
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Informe Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-md h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    {"Email ou CPF"}
                  </label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Informe seu Email ou CPF"
                    value={email}
                    onChange={handleEmailCpfChange}
                    onBlur={handleEmailCpfBlur}
                    className={`w-full rounded-md h-11 sm:h-12 text-sm sm:text-base ${
                      emailCpfError ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                    required
                  />
                  {emailCpfError && <p className="text-xs text-red-600">{emailCpfError}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    {"Senha"}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    {"Confirmar Senha"}
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1F4C47] hover:bg-[#163a36] text-white"
                >
                  {isLoading ? "Criando conta..." : "Criar uma nova conta"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">{"Já tem uma conta? "}</span>
                <Link href="/login" className="text-[#1F4C47] hover:underline font-medium">
                  {"Fazer Login"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:absolute lg:bottom-16 lg:left-20 lg:right-16 mt-8 lg:mt-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-sm">
            <span>{`©MeetOff, ${year}`}</span>
            <a href="#" className="hover:text-foreground underline">
              {"Termos e Política de privacidade"}
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative lg:min-h-screen rounded-l-4xl rounded-r-4xl">
        <Image
          src="https://images.unsplash.com/photo-1631287941887-7b5185ff4791?q=80&w=1920"
          alt="Celular mostrando a plataforma de conexões"
          fill
          className="object-cover rounded-l-4xl rounded-r-4xl"
          priority
        />

        <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
          <div className="backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-white space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-pretty">
                {"Acesso único, experiências autênticas."}
              </h2>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-pretty">
                {"Cada convite é um portal. Use seu token e viva algo que só você pode experienciar."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
