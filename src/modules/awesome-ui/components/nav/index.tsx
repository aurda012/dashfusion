'use client';

import Link from 'next/link';
import { components } from '..';
import { usePathname } from 'next/navigation';

const Nav = () => {
  const path = usePathname();
  const sortedComponents = components.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return (
    <div className="relative z-50 w-[270px] overflow-hidden px-2 py-4">
      {sortedComponents.map((comp) => (
        <Link
          scroll={true}
          key={comp.name}
          href={comp.path}
          className={`${path === comp.path ? 'font-medium text-foreground' : 'text-muted-foreground'}group flex w-full items-center rounded-md border border-transparent px-2 py-1 transition duration-200 hover:translate-x-1 hover:text-primary`}
        >
          <p>{comp.name}</p>
        </Link>
      ))}
    </div>
  );
};
export default Nav;
