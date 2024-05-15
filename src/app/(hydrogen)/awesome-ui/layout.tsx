import Nav from '@/modules/awesome-ui/components/nav';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container flex-1 items-start lg:grid  lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fix top-fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 lg:sticky lg:block lg:self-start">
        <Nav />
      </aside>
      {children}
    </div>
  );
}
