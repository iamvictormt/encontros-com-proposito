"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

const carouselSlides = [
  {
    image: "https://images.pexels.com/photos/9578709/pexels-photo-9578709.jpeg",
    title: "Grandes Experiências começam aqui",
    description:
      "Descubra eventos que unem pessoas, histórias e propósitos presenciais ou online, com experiências únicas que fazem sentido pra você.",
  },
  {
    image: "https://images.unsplash.com/photo-1549342902-be005322599a?q=100&w=1920",
    title: "Conecte-se com pessoas reais",
    description:
      "Participe de encontros presenciais e online que transformam conexões em relacionamentos verdadeiros.",
  },
  {
    image: "https://images.unsplash.com/photo-1613093335399-829e30811789?q=100&w=1920",
    title: "Experiências que fazem sentido",
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

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);

    // Sync auth loading with global loading
    setGlobalLoading(authLoading);

    if (!authLoading && isLoggedIn && user && !showSuccessVideo) {
      router.push(user.isAdmin ? "/admin" : "/events");
    }
  }, [authLoading, isLoggedIn, user, router, showSuccessVideo, setGlobalLoading]);

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
      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Left Column - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-8 md:p-12 lg:p-16 relative ">
          <div className="lg:absolute lg:top-6 lg:left-20 mb-8 lg:mb-0">
            <Logo className="justify-center flex md:block" />
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            <div className="w-full max-w-md space-y-6 sm:space-y-10">
              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-5 text-center mb-10">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase italic text-black leading-tight">
                    {"Bem-vindo(a) de volta!"}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {"Conecte-se para continuar sua jornada."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      {"Email ou Telefone"}
                    </label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Informe seu Email ou Telefone"
                      value={email}
                      onChange={handleEmailPhoneChange}
                      onBlur={handleEmailPhoneBlur}
                      className={`w-full rounded-md h-11 sm:h-12 text-sm sm:text-base ${
                        emailPhoneError ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      required
                    />
                    {emailPhoneError && <p className="text-xs text-red-600">{emailPhoneError}</p>}
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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-black cursor-pointer"
                    >
                      {"Lembrar de mim"}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="secondary"
                    className="w-full font-black uppercase italic h-12 sm:h-14 text-base rounded-2xl disabled:opacity-50"
                  >
                    {isLoading ? "Entrando..." : "Iniciar Sessão"}
                  </Button>
                </form>

                <div className="text-center text-sm flex flex-col gap-3">
                  <div>
                    <span className="text-muted-foreground">{"Não possui uma conta? "}</span>
                    <Link href="/signup" className="text-secondary hover:underline font-black uppercase italic">
                      {"Criar uma nova conta"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:absolute lg:bottom-16 lg:left-20 lg:right-16 mt-8 lg:mt-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-sm">
              <span className="text-gray-500">{`©MeetOff, ${year}`}</span>
              <a href="#" className="text-black hover:text-black underline">
                {"Termos e Política de privacidade"}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Hero Carousel */}
        <div className="hidden lg:block lg:w-1/2 relative lg:min-h-screen rounded-l-4xl rounded-r-4xl">
          <Image
            src={carouselSlides[currentSlide].image || "/placeholder.svg"}
            alt="Pessoas conectadas em experiências"
            fill
            className="object-cover transition-opacity duration-500 rounded-l-4xl rounded-r-4xl"
            priority
          />

          <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
            <div className="backdrop-blur-lg rounded-[2.5rem] p-10 border border-white/20 bg-black/20">
              <div className="text-white space-y-6">
                <h2 className="text-3xl md:text-5xl font-black uppercase italic leading-tight">
                  {carouselSlides[currentSlide].title}
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-pretty">
                  {carouselSlides[currentSlide].description}
                </p>

                <div className="flex items-center justify-between pt-4">
                  {/* Pagination dots */}
                  <div className="flex gap-2">
                    {carouselSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentSlide
                            ? "w-10 bg-white h-[5px]"
                            : "w-2 h-[5px] bg-white/50 hover:bg-white/70 cursor-pointer"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation arrows */}
                  <div className="flex gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-4 rounded-full border border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Previous slide"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-4 rounded-full border border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Next slide"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
