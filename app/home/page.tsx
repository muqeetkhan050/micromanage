'use Client'

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">    
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
