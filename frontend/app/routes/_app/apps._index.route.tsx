import { Link } from '@remix-run/react';
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
import { useCustomFetcher } from '~/hooks/useCustomFetcher';
import { useCustomQuery } from '~/hooks/useCustomQuery';

export const schema = z.object({
  name: z
    .string().optional()
});

const validator = withZod(schema);

export default function Page() {

  const { data = [] } = useCustomQuery<Array<App & {id: string}>>({
    queryKey: ['apps'],
    queryFn: ()=>fetch('/resources/app').then(async (res) => res.json())
  });

  return (
    <>
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
              <Link to={`${app.id}/overview`} key={app.id}>
                <AppItem app={app} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AppItem({ app }: {app: App & {id: string}}) {
  return (
    <div className="border border-black-5 p-4 rounded bg-white border border-black-5 px-6 py-7 rounded-2xl min-h-[170px] hover:scale-[1.02] transition-all duration-200 active:scale=[0.97] hover:shadow-lg flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-xl">{app.name}</h3>
        <p className="text-black-8">{app.id}</p>
      </div>
      <div className='flex justify-between items-center'>
        <div></div>
        <div className='flex gap-2'>
          <p>0 images</p>
          <p>0 total size</p>
        </div>
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
          action="/resources/app"
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
