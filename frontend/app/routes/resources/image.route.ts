import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { Auth } from '~/modules/auth.server';
import { Image } from '~/modules/image.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!Auth.validateToken(request)) {
    return json({ error: true, message: 'Unauthorized' }, { status: 401 });
  }

  const { data: images, error } = await Image.getImages({ request });

  if (error) return json({ error: true, message: 'Image.getImages returns error' });
  return json(images);
};
