import Dashboard from "@/components/dashboard"
import { cookies } from 'next/headers';

export default async function Example() {
  const profileId = (await cookies()).get('profileId')?.value;
    return (
      <Dashboard profileId={profileId} />
    )
}
