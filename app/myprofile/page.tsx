import Dashboard from "@/components/dashboard"
import { cookies } from 'next/headers';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  const profileIdCookie = (await cookies()).get('profileId')?.value;
  const roleCookie = (await cookies()).get('role')?.value;
  const roleArray = ['son', 'parent'];
  if (params && params.profileid) {
    const profileId = params.profileid;
    return (
      <Dashboard profileId={profileId} logout={params.logout} role={params && params.role && roleArray.includes(params.role) ? params.role : undefined} />
    )
  } else if (profileIdCookie) {
    return (
      <Dashboard profileId={profileIdCookie} logout={params.logout} role={roleCookie} />
    )
  }
  return (
    <Dashboard profileId={undefined} logout={params.logout} role={undefined}/>
  )
}
