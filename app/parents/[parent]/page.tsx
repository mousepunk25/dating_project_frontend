import ParentProfile from '@/components/parent-profile';

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