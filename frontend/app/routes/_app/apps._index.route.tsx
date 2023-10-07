import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  useLoaderData
} from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { App } from '@shared/types/app';
import { useState } from 'react';
import { ValidatedForm } from 'remix-validated-form';
import { z } from 'zod';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/primitives/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/primitives/DropdownMenu';
import { useCustomFetcher } from '~/hooks/useCustomFetcher';
import { useCustomQuery } from '~/hooks/useCustomQuery';
import { Auth } from '~/modules/auth.server';
import { User } from '~/modules/user.server';

export const schema = z.object({
  name: z
    .string().optional()
});

const validator = withZod(schema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (!tokenValidated) {
    return redirect('/login');
  }

  const user = await User.getUser(request);

  return json({ user });
};

export default function Page() {
  const { user } = useLoaderData();

  const { data = [] } = useCustomQuery<Array<App & {id: string}>>({
    queryKey: ['apps'],
    queryFn: ()=>fetch('/resources/apps').then(async (res) => res.json())
  });

  return (
    <>
      <Topbar user={user} />

      <div className="flex justify-center">
        <div className="max-w-[1148px] w-full p-6 flex flex-col gap-8">
          <div className="flex justify-between mt-6">
            <div className="">
              <h1 className="font-bold text-3xl">My Apps</h1>
            </div>
            <div>
              <CreateAppDialog />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {data && data.length && data.map(app=>(
              <Link to={app.id} key={app.id}>
                <AppItem app={app} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Topbar({ user }: {user: { id: string; email: string} | null}) {
  return (
    <div className="flex border-b bg-white border-black-5 justify-center h-20 items-center">
      <div className="max-w-[1148px] w-full px-6 flex justify-between">
        <Link to="/apps" className="">
          <img src="logo-uploadje.svg" className="h-9" />
        </Link>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-2 h-10">{user?.email}</button>
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

function AppItem({ app }: {app: App}) {
  return (
    <div className="border border-black-5 p-4 rounded bg-white border border-black-5 px-6 py-7 rounded-2xl min-h-[170px] hover:scale-[1.02] transition-all duration-200 active:scale=[0.97] hover:shadow-lg">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-xl">{app.name}</h3>
        <p className="text-black-8">{app.name}</p>
      </div>
    </div>
  );
}

function CreateAppDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { fetcher } = useCustomFetcher({
    onSuccess: ()=>setDialogOpen(false)
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button className="bg-gradient-to-b from-primary-light to-primary font-medium text-white h-9 rounded-lg px-2">
          <span>Add new app</span>
        </button>
      </DialogTrigger>
      <DialogContent className="md:w-[420px]">
        <DialogHeader>
          <DialogTitle>Create new App</DialogTitle>
          <DialogDescription>
            Create an app to store your images.
          </DialogDescription>
        </DialogHeader>
        <ValidatedForm
          action="/resources/apps"
          fetcher={fetcher}
          validator={validator}
          method="post"
          className="contents"
        >
          <div className="flex flex-col gap-6">
            <FormTextField
              name="name"
              label="App Name"
              placeholder="My First App"
            />
          </div>
          <FormButton label="Create app" />
        </ValidatedForm>
      </DialogContent>
    </Dialog>
  );
}
