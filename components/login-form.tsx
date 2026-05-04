"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { APIError } from "@/lib/services/api-client";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLoading } from "@/providers/loading-provider";
import { authService } from "@/lib/services/auth.service";
import {
  formatPhone,
  unformatPhone,
  validatePhone,
  validateEmail,
  detectInputType,
} from "@/lib/utils/validators";
import { cn } from "@/lib/utils";
import { ForgotPasswordModal } from "./modals/forgot-password-modal";

const carouselSlides = [
  {
    image: "https://images.pexels.com/photos/9578709/pexels-photo-9578709.jpeg",
    title: "Grandes experiências",
    highlightedText: "começam aqui",
    description:
      "Descubra eventos que unem pessoas, histórias e propósitos presenciais ou online, com experiências únicas que fazem sentido pra você.",
  },
  {
    image: "https://images.unsplash.com/photo-1549342902-be005322599a?q=100&w=1920",
    title: "Conecte-se",
    highlightedText: "com pessoas reais",
    description:
      "Participe de encontros presenciais e online que transformam conexões em relacionamentos verdadeiros.",
  },
  {
    image: "https://images.unsplash.com/photo-1613093335399-829e30811789?q=100&w=1920",
    title: "Experiências",
    highlightedText: "que fazem sentido",
    description:
      "Viva momentos autênticos através de retiros, terapias e eventos que unem tecnologia e emoção.",
  },
];

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [year, setYear] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [emailPhoneError, setEmailPhoneError] = useState("");
  const { isLoggedIn, user, isLoading: authLoading, refreshAuth } = useAuth();
  const { setIsLoading: setGlobalLoading } = useLoading();
  const router = useRouter();
  const { toast } = useToast();
  const [showSuccessVideo, setShowSuccessVideo] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);

    // Sync auth loading with global loading
    setGlobalLoading(authLoading);

    if (!authLoading && isLoggedIn && user && !showSuccessVideo) {
      router.push(user.isAdmin ? "/admin" : "/events");
    }
  }, [authLoading, isLoggedIn, user, router, showSuccessVideo, setGlobalLoading]);

  // Auto-slide carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleEmailPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const inputType = detectInputType(value);

    if (inputType === "phone") {
      const formatted = formatPhone(value);
      setEmail(formatted);
      setEmailPhoneError("");
    } else if (inputType === "email") {
      setEmail(value);
      setEmailPhoneError("");
    } else {
      setEmail(value);
    }
  };

  const handleEmailPhoneBlur = () => {
    if (!email) return;

    const inputType = detectInputType(email);

    if (inputType === "phone") {
      const phoneNumbers = unformatPhone(email);
      if (phoneNumbers.length >= 10 && !validatePhone(email)) {
        setEmailPhoneError("Telefone inválido");
      } else if (phoneNumbers.length > 0 && phoneNumbers.length < 10) {
        setEmailPhoneError("Telefone incompleto");
      } else {
        setEmailPhoneError("");
      }
    } else if (inputType === "email") {
      if (!validateEmail(email)) {
        setEmailPhoneError("Email inválido");
      } else {
        setEmailPhoneError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailPhoneError) {
      toast({
        variant: "error",
        title: "Erro de validação",
        description: emailPhoneError,
      });
      return;
    }

    setIsLoading(true);
    setGlobalLoading(true);

    try {
      const inputType = detectInputType(email);
      const loginIdentifier = inputType === "phone" ? unformatPhone(email) : email;

      const response = await authService.login({
        emailOrPhone: loginIdentifier,
        password,
        rememberMe,
      });

      setUserData(response.user);

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado.",
        variant: "success",
      });

      setShowSuccessVideo(true);

      // Update auth context
      await refreshAuth();

      // Fallback redirection after 5 seconds in case video doesn't end properly
      // or if it takes too long to show up
      setTimeout(() => {
        if (response.user.isAdmin) {
          router.push("/admin");
        } else {
          router.push("/events");
        }
      }, 6000);
    } catch (err) {
      if (err instanceof APIError) {
        toast({
          variant: "error",
          title: "Erro ao fazer login",
          description: err.message,
        });
      } else {
        toast({
          variant: "error",
          title: "Erro ao conectar",
          description: "Erro ao conectar com o servidor",
        });
      }
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (authLoading) {
    return null; // Global loader is handled by LoadingProvider
  }

  return (
    <>
      {showSuccessVideo && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-1000 opacity-100">
          <video
            ref={(el) => {
              if (el) {
                el.play().catch(err => console.error("Video play failed:", err));
              }
            }}
            src="/videos/meet-off-animation-logo.mp4"
            autoPlay
            playsInline
            onEnded={() => {
              if (userData?.isAdmin) {
                router.push("/admin");
              } else {
                router.push("/events");
              }
            }}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* Left Column - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-20 relative">
          <div className="mb-12">
            <Logo className="justify-center flex md:block" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-brand-black tracking-tighter uppercase leading-none">
                  Bem-vindo(a) <br/><span className="text-brand-orange">de volta!</span>
                </h2>
                <p className="text-gray-500 font-medium">
                  Acesse sua conta para continuar vivendo experiências únicas e conexões reais.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Email ou Telefone
                  </label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="ex@email.com"
                    value={email}
                    onChange={handleEmailPhoneChange}
                    onBlur={handleEmailPhoneBlur}
                    className={cn(
                      "w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6",
                      emailPhoneError && "border-brand-red focus:border-brand-red"
                    )}
                    required
                  />
                  {emailPhoneError && <p className="text-[10px] text-brand-red font-bold uppercase tracking-wide px-1">{emailPhoneError}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" title="Senha" className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 rounded-2xl bg-white border-brand-green/10 focus:border-brand-orange transition-all font-medium px-6"
                    required
                  />
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="rounded-md border-brand-green/20 data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
                    />
                    <label
                      htmlFor="remember"
                      className="text-xs font-bold text-brand-black uppercase tracking-wide cursor-pointer"
                    >
                      Manter conectado
                    </label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs font-bold text-brand-orange uppercase tracking-wide hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Iniciar Sessão"}
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-sm font-medium text-gray-500">
                  Ainda não faz parte?{" "}
                  <Link href="/signup" className="text-brand-orange font-black uppercase tracking-widest text-xs hover:underline ml-2">
                    Criar conta
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>© MeetOff {year}</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-brand-black transition-colors">Termos</a>
              <a href="#" className="hover:text-brand-black transition-colors">Privacidade</a>
            </div>
          </div>
        </div>

        {/* Right Column - Hero Carousel */}
        <div className="hidden lg:block lg:w-1/2 relative p-8">
          <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden shadow-2xl">
            <Image
              src={carouselSlides[currentSlide].image || "/placeholder.svg"}
              alt="Background"
              fill
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-12">
              <div className="glass-dark p-12 rounded-[2.5rem] border-white/20 shadow-2xl">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none text-pretty">
                    <span className="text-brand-orange">{carouselSlides[currentSlide].title}{" "}</span>
                    {carouselSlides[currentSlide].highlightedText}
                  </h2>
                  <p className="text-lg font-medium text-white/80 leading-relaxed text-pretty">
                    {carouselSlides[currentSlide].description}
                  </p>

                  <div className="flex items-center justify-between pt-6">
                    <div className="flex gap-3">
                      {carouselSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            index === currentSlide ? "w-12 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
                          )}
                          aria-label={`Slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </>
  );
}
