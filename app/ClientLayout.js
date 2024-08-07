'use client';

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import ParticlesBackground from "../components/Particles";
import Splashscreen from "@/components/Splashscreen";
import { usePathname } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  return (
    <SessionProvider>
      {isLoading && isHome ? (
        <Splashscreen finishLoading={() => setIsLoading(false)} />
      ) : (
        <>
          <ParticlesBackground />
          {children}
          <ToastContainer
            position="top-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </>
      )}
    </SessionProvider>
  );
}