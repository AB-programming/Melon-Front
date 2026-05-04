import { ArrowLeft } from 'lucide-react';
import { PostComment } from '@/components/PostComment';
import { PostContent } from '@/components/PostContent';
import Link from 'next/link';

export default async function PostDetails(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return (
    <div className="flex flex-col">
      {/* header section */}
      <div className="flex items-center gap-8">
        <Link href="/post">
          <ArrowLeft />
        </Link>
        <h2 className="text-xl font-bold">帖子</h2>
      </div>
      {/* content section */}
      <PostContent postId={id} />
      {/* comment section */}
      <PostComment />
    </div>
  )
}