import { auth } from "@/lib/auth";
import { logoutAction } from "@/features/auth/actions";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Signed in as {session?.user?.name} ({session?.user?.role})
      </p>
      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}