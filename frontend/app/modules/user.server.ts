import { ofetch } from 'ofetch';

import { getSession } from '~/utils/sessions.server';

class User {
  static async getUser (request: Request) {
    let user = null;

    const session = await getSession(
      request.headers.get('Cookie')
    );

    if (session.has('token')) {
      const token = session.get('token');

      await ofetch(
        `${process.env.BACKEND_URL}/v1/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          parseResponse: JSON.parse
        })
        .then((res)=>{
          user=res;
        })
        .catch((err) => {
          console.log('err.data: ', err.data);
        });
    }

    return user;
  }
}

export { User };
