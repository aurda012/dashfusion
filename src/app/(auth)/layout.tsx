'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';
import DarkModeSwitcher from '@/components/common/dark-mode-switcher';
import Header from './header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        elements: {
          formFieldInput: 'rounded-md bg-background border-primary',
          formButtonPrimary: 'bg-primary',
          footerActionLink: 'hover:text-primary',
        },
      }}
    >
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-160px)] w-full items-center justify-center pb-12 pt-6 sm:pb-4">
          {children}
          <DarkModeSwitcher />
        </div>
      </>
    </ClerkProvider>
  );
}
