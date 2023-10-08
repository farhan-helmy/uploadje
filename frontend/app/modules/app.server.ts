import type { App as AppType } from '@shared/types/app';
import { ofetch } from 'ofetch';

import { getSession } from '~/utils/sessions.server';

class App {
  static async getApps({ request }: {request: Request}): Promise<{
    data: AppType[] | null;
    error: boolean;
  }> {
    const session = await getSession(
      request.headers.get('Cookie')
    );

    const token = session.get('token');

    let data: AppType | null = null;
    let error = false;

    await ofetch(
      `${process.env.BACKEND_URL}/v1/app`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
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

  static async createApp({ request, name }: {request: Request, name: string | undefined}): Promise<{
    data: AppType | null;
    error: boolean;
  }> {
    let data: AppType | null = null;
    let error = false;

    const session = await getSession(
      request.headers.get('Cookie')
    );
    const token = session.get('token');

    await ofetch(
      `${process.env.BACKEND_URL}/v1/app`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: name && {
          name
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

export { App };
