import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import { App } from '~/modules/app.server';
import { Auth } from '~/modules/auth.server';

export const schema = z.object({
  name: z
    .string().optional()
});

const validator = withZod(schema);

// GET: get all apps
export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!Auth.validateToken(request)) {
    return json({ error: true, message: 'Unauthorized' }, { status: 401 });
  }

  const { data: apps, error } = await App.getApps({ request });

  if (error) return json({ error: true, message: 'App.getApps returns error' });
  return json(apps);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json(
      { error: { message: 'Method Not Allowed' } },
      { status: 405 });
  }

  if (!Auth.validateToken(request)) {
    return json({ error: true, message: 'Unauthorized' }, { status: 401 });
  }

  switch (request.method) {
    case 'POST' : {
      const result = await validator.validate(
        await request.formData()
      );
      if (result.error)
        return validationError(result.error, result.submittedData);
      const { name } = result.data;

      const { data: apps, error } = await App.createApp({ request, name });

      if (error) return json({ error: true, message: 'App.createApp returns error' });
      return json(apps);
    }
  }
};
