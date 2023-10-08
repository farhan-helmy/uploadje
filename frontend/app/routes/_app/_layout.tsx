import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  Outlet,
  useLoaderData
} from '@remix-run/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/primitives/DropdownMenu';
import { Auth } from '~/modules/auth.server';
import { User } from '~/modules/user.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    return redirect('/login');
  }

  const user = await User.getUser(request);

  return json({ user });
};

export default function Layout() {
  const { user } = useLoaderData();

  return (
    <div className="sm:bg-neutral-100 min-h-[100dvh] flex flex-col">
      <Topbar user={user} />
      <Outlet />
    </div>
  );
}

function Topbar({ user }: {user: { id: string; email: string} | null}) {
  return (
    <div className="flex border-b bg-white border-black-5 justify-center h-20 items-center">
      <div className="max-w-[1148px] w-full px-6 flex justify-between">
        <Link to="/apps" className="">
          <img src="/logo-uploadje.svg" className="h-9" />
        </Link>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-2 h-10 flex gap-2 items-center justify-end"><span className='text-right'>{user?.email}</span><div className='h-8 w-8 rounded-full bg-black-3 flex-none border border-black-5'></div></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <Form
                action="/logout"
                className="contents"
                method="POST"
              >
                <DropdownMenuItem asChild>
                  <button className="w-full">Log out</button>
                </DropdownMenuItem>
              </Form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
