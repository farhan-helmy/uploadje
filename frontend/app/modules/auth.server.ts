import { json } from '@remix-run/node';
import { ofetch } from 'ofetch';

import { commitSession, getSession } from '~/utils/sessions.server';

class Auth {
  static async verifyLogin (email: string, password: string) {

    let error = false;

    const result = await ofetch(
      `${process.env.BACKEND_URL}/v1/auth/login`, {
        method: 'POST',
        body: { email, password },
        parseResponse: JSON.parse
      })
      .catch((err) => {
        error = true;

        return {
          __type: 'Error',
          error: true,
          message: err.data.message,
          statusCode: err.data.code,
        };
      });

    if (error) { return result; }
    const { token } = result;

    return {
      __type: 'Auth',
      token,
    };
  }

  static async register (
    email: string,
    password: string,
    confirmPassword:string
  ) {

    let error = false;

    const result = await ofetch(
      `${process.env.BACKEND_URL}/v1/auth/register`, {
        method: 'POST',
        body: { email, password, confirmPassword },
        parseResponse: JSON.parse
      })
      .catch((err) => {
        error = true;

        return {
          __type: 'Error',
          error: true,
          message: err.data.message,
          statusCode: err.data.code,
        };
      });

    if (error) { return result; }
    const { token } = result;

    return {
      __type: 'Auth',
      token,
    };
  }

  static async validateToken (request: Request) {
    let error = false;

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
        .catch((err) => {
          error = true;
        });

      if (error) { return false; }
      return true;
    }

    return false;
  }

  static async getToken (request: Request) {
    const session = await getSession(
      request.headers.get('Cookie')
    );

    const tokenSession = session.get('token');

    if (tokenSession)
    {
      const { token } = tokenSession;
      return token;
    }

    return null;
  }

  static async unauthorizedResponse (request: Request) {
    const session = await getSession(
      request.headers.get('Cookie')
    );

    const tokenValidated = await Auth.validateToken(request);

    if (!tokenValidated) {
      session.flash(
        'error',
        'You aren\'t logged in! Log in to create a listing.'
      );

      return json({ message: 'Unauthorized' }, {
        status: 401,
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
    }
  }
}

export { Auth };
