import {
  Link,
  Outlet,
  useLocation
} from '@remix-run/react';
import type { ReactNode } from 'react';

export default function Layout() {
  const path = useLocation().pathname;

  return (
    <div className="flex sm:justify-center items-center sm:px-6 max-sm:pt-14 pb-20 h-screen sm:bg-neutral-100 flex-col gap-14">
      <Link to="/" className="absolute left-8 top-6"><p className="font-semibold text-xl">Home</p></Link>
      <img src="logo-uploadje.svg" className="h-16" />

      <Card>
        <Outlet />
      </Card>

      {path === '/signup' ?
        <p className="self-center text-neutral-500">
          Already have an account?{' '}
          <Link className="text-primary" to="/login">Log in</Link>
        </p> :
        <p className="self-center text-neutral-500">
          Don't have an account yet?{' '}
          <Link className="text-primary" to="/signup">Sign up</Link>
        </p>
      }
    </div>
  );
}

function Card({ children }: {children?: ReactNode} = {}) {
  return (
    <div className="w-full max-w-[460px] rounded-[18px] px-7 sm:px-8 py-8 bg-white border border-black-5 flex flex-col gap-7">
      {children}
    </div>
  );
}
