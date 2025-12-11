'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Logo } from './logo';
import { useAuth } from '@/hooks/use-auth';

export function Login() {
  const [inviteCode, setInviteCode] = useState('');
  const router = useRouter();
  const [year, setYear] = useState('');
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setYear(currentYear);

    if (!authLoading && isLoggedIn) {
      router.push('/events');
    }
  }, [authLoading, isLoggedIn, router]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  const handleGuestLogin = () => {
    router.push('/events');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-8 md:p-12 lg:p-16 lg:relative">
        <div className="lg:absolute lg:top-6 lg:left-20 mb-8 lg:mb-0">
          <Logo className="text-center lg:text-left" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6 sm:space-y-10">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
              <Image
                src="images/meet-off.png"
                alt="MeetOff"
                width={100}
                height={40}
                className="h-10 sm:h-12 w-auto object-contain"
              />

              <Image
                src="images/findb.png?height=40&width=80"
                alt="FindB"
                width={80}
                height={40}
                className="h-10 sm:h-12 w-auto object-contain"
              />

              <Image
                src="images/checkin-love.png?height=40&width=120"
                alt="Check-in Love"
                width={120}
                height={40}
                className="h-10 sm:h-12 w-auto object-contain"
              />

              <Image
                src="images/mimo-meu-e-seu.png?height=40&width=100"
                alt="Mimo Meu e Seu"
                width={100}
                height={40}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>

            {/* Main Content */}
            <div className="space-y-5 sm:space-y-6 pt-3 sm:pt-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black text-center">
                {'Conecte-se com propósito.'}
              </h2>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  className="w-full bg-[#8A0204] border-[#8A0204] hover:bg-[#6a0103] text-white font-medium py-5 sm:py-6 text-sm sm:text-base rounded-md"
                >
                  {'Entrar'}
                </Button>

                <Button
                  onClick={handleCreateAccount}
                  variant="outline"
                  className="w-full bg-[#1F4C47] border-[#1F4C47] hover:bg-[#163a36] text-white font-medium py-5 sm:py-6 text-sm sm:text-base rounded-md"
                >
                  {'Criar uma nova conta'}
                </Button>

                <Button
                  onClick={handleGuestLogin}
                  variant="outline"
                  className="w-full border-[#F18D42] text-[#F18D42] hover:bg-[#F18D42] hover:text-white font-medium py-5 sm:py-6 text-sm sm:text-base bg-transparent rounded-md"
                >
                  {'Entrar como convidado'}
                </Button>
              </div>

              {/* Invite Code Section */}
              <div className="space-y-3 pt-2 sm:pt-4">
                <p className="text-xs sm:text-sm font-medium text-foreground">{'Já tem um código de convite?'}</p>
                <Input
                  type="text"
                  placeholder="Inserir"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full rounded-md h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:absolute lg:bottom-16 lg:left-20 lg:right-16 mt-8 lg:mt-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-sm">
            <span className="text-muted-foreground">{`©CheckLove, ${year}`}</span>
            <a href="#" className="hover:text-foreground underline">
              {'Termos e Política de privacidade'}
            </a>
          </div>
        </div>
      </div>

      {/* Right Column - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative lg:min-h-screen rounded-l-4xl rounded-r-4xl">
        <Image
          src="/images/homem-e-mulher.jpg"
          alt="Casal feliz representando conexões com propósito"
          fill
          className="object-cover rounded-l-4xl rounded-r-4xl"
          priority
        />

        {/* Overlay Text */}
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
          <div className="backdrop-blur-md bg-black/20 rounded-xl p-8 border border-white/20">
            <div className="text-white space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-pretty">{'João Carlos & Labernarde'}</h2>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-pretty">
                {
                  'terapeuta, mentor e criador de experiências com propósito. Vivo para ajudar pessoas a se reconectarem de forma real, segura e afetiva por meio de encontros presenciais, retiros e projetos que unem tecnologia e emoção.'
                }
                <br />
                <br />

                {'Criei plataformas como'}
                <span className="font-semibold">{' MeetOff, FindB, Check-in Love'}</span>
                {' para transformar relacionamentos, terapias e presentes em conexões verdadeiras.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
