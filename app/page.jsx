"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ButtonShapeTabs from "../components/ButtonShapeTabs";
import UserAvatar from "../components/UserAvatar";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-10 relative">
        <div className="relative flex flex-col items-center">
          <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="/next.webp"
              alt="Next.js Logo"
              width={200}
              height={50}
              priority
            />
          </div>
          <div>
            <ButtonShapeTabs />
          </div>
        </div>
        {session && <UserAvatar user={session.user} />}
      </main>
      <footer className="py-4 text-center text-sm text-gray-400">
        <p className="mb-2">© 2024 Yassine Dorgâa. All rights reserved.</p>
      </footer>
    </>
  );
}
