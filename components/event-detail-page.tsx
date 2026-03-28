'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Logo } from './logo';

export function EventDetailPage() {
  const router = useRouter();
  const [eventCode, setEventCode] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 sm:p-8 md:p-12 relative">
      {/* Top Navigation */}
      <div className="w-full max-w-7xl flex items-center justify-between z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm sm:text-base cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 top-10 flex flex-col items-center">
          <Logo href="/events" />
        </div>

        <div className="w-20 hidden sm:block"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md flex flex-col items-center justify-center flex-1 mt-20 sm:mt-0">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Participar do Evento
            </h1>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-medium text-[#1F4C47]">
                Código do Evento
              </p>
              <Input
                type="text"
                placeholder="Inserir"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                className="w-full rounded-md h-12 sm:h-14 text-sm sm:text-base border-gray-200 focus:border-[#8A0204] focus:ring-[#8A0204]"
              />
            </div>

            <Button
              className="w-full bg-[#8A0204] hover:bg-[#6a0103] text-white font-bold py-6 sm:py-7 text-base sm:text-lg rounded-md transition-all shadow-md active:scale-[0.98]"
            >
              Participar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
