import type { Image as ImageType } from '@shared/types/image';
import { ofetch } from 'ofetch';

import { invariant } from '~/utils/invariant';
import { getSession } from '~/utils/sessions.server';

class Image {
  static async getImages({ request }: {request: Request}): Promise<{
    data: ImageType[] | null;
    error: boolean;
  }> {

    let data: ImageType[] | null = null;
    let error = false;

    const { headers } = request;

    const session = await getSession(
      headers.get('Cookie')
    );

    const UPLOADJE_APP_ID = headers.get('UPLOADJE_APP_ID');
    const UPLOADJE_APP_SECRET = headers.get('UPLOADJE_APP_SECRET');

    invariant(UPLOADJE_APP_ID && UPLOADJE_APP_SECRET,
      'UPLOADJE_APP_ID and UPLOADJE_APP_SECRET headers are required');

    const token = session.get('token');

    await ofetch(
      `${process.env.BACKEND_URL}/v1/image`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'UPLOADJE_APP_ID': UPLOADJE_APP_ID,
          'UPLOADJE_APP_SECRET': UPLOADJE_APP_SECRET,
        },
        parseResponse: JSON.parse
      })
      .then((res)=>{
        data=res;
      })
      .catch((err) => {
        error = true;
        console.log('err.data: ', err.data);
      });

    return { data, error };
  }
}

export { Image };
