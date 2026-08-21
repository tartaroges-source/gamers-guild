import Image from 'next/image';
import { LoginForm } from '@/components/LoginForm';
import { Reticle } from '@/components/Reticle';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
<Reticle className="text-guild-green/[0.06] pointer-events-none absolute top-1/2 left-1/2 h-[700px] w-[700px] animate-spin-slow" />
      
      <div className="border-guild-green/20 bg-surface relative w-full max-w-sm rounded-lg border p-8 shadow-lg">
      
        <div className="flex items-center justify-center gap-4">
          <Image src="/logo.png" alt="Gamers' Guild crest" width={75} height={75} />
          <div className="bg-guild-green/30 h-10 w-px" />
          <Image src="/uc-logo.png" alt="University of Cabuyao seal" width={56} height={56} />
        </div>
        <h1 className="font-display text-foreground mt-6 text-center text-2xl font-semibold uppercase">
          Gamers&apos; Guild Officer Login
        </h1>
        <p className="text-muted mt-1 text-center text-xs">Pamantasan ng Cabuyao</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}