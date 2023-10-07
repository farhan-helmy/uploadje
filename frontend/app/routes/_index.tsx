import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { Auth } from '~/modules/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (tokenValidated) {
    return redirect('/apps');
  }

  return redirect('/login');
};
