import ParentProfile from '@/components/parent-profile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil rodzica',
};

export default async function Page({
    params,
}: {
    params: Promise<{ parent: string }>
}) {
    const { parent } = await params;
    return (
        <ParentProfile parentId={parent} />
    )
}