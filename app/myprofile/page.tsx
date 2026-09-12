import Dashboard from "@/components/dashboard"
import { cookies } from 'next/headers';

type Role = 'son' | 'parent';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  // Validate role
  const rawRole = params.role || cookieStore.get('role')?.value;
  const role: Role | undefined = rawRole === 'son' || rawRole === 'parent' ? rawRole : undefined;

  // Resolve profile ID with query params prioritizing cookie fallback
  const profileId = params.profileid || cookieStore.get('profileId')?.value;

  return (
    <Dashboard 
      profileId={profileId} 
      logout={params.logout} 
      role={role} 
    />
  );
}
