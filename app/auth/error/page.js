'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthErrorComponent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center text-red-600">Authentication Error</h3>
        <p className="mt-4 text-center">{error || 'An error occurred during authentication'}</p>
        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Try signing in again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorComponent />
    </Suspense>
  );
}
