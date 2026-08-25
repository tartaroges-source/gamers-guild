import Image from 'next/image';
import { auth } from '@/lib/auth';
import { AvatarUploadForm } from '@/components/AvatarUploadForm';
import { ChangePasswordForm } from '@/components/ChangePasswordForm';

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        My Profile
      </h1>
      <div className="mt-8 flex max-w-md flex-col gap-6">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="bg-surface text-guild-green font-display flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
              {session?.user?.name?.charAt(0) ?? '?'}
            </div>
          )}
          <div>
            <p className="font-display text-foreground font-bold uppercase">
              {session?.user?.name}
            </p>
            <p className="text-muted text-sm">{session?.user?.email}</p>
          </div>
        </div>
        <AvatarUploadForm />
        <div>
  <h2 className="font-display text-lg font-bold text-foreground uppercase">Change Password</h2>
  <div className="mt-3">
    <ChangePasswordForm />
  </div>
</div>
      </div>
    </main>
  );
}