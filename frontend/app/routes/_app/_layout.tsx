import { Outlet } from '@remix-run/react';

export default function Layout() {

  return (
    <div className="sm:bg-neutral-100 min-h-[100dvh]">
      <Outlet />
    </div>
  );
}
