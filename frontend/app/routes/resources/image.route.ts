import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import type { Image } from '@shared/types/image';
import { ofetch } from 'ofetch';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import { Auth } from '~/modules/auth.server';
import { getSession } from '~/utils/sessions.server';

// export const schema = z.object({
//   name: z
//     .string().optional()
// });

// const validator = withZod(schema);

// GET: get all images
export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!Auth.validateToken(request)) {
    return json({ error: true, message: 'Unauthorized' }, { status: 401 });
  }

  let images: Image | null = null;

  const session = await getSession(
    request.headers.get('Cookie')
  );

  const UPLOADJE_APP_ID = request.headers.get('UPLOADJE_APP_ID');
  const UPLOADJE_APP_SECRET = request.headers.get('UPLOADJE_APP_SECRET');

  console.log('UPLOADJE_APP_ID', UPLOADJE_APP_ID);
  console.log('UPLOADJE_APP_SECRET', UPLOADJE_APP_SECRET);

  const token = session.get('token');

  let error = false;

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
      images=res;
    })
    .catch((err) => {
      error = true;
      console.log('err.data: ', err.data);
    });

  if (error) {
    return json({ error: true, message: '/resource/image GET failed' });
  }

  console.log(images);

  return json(images);
};

// export const action = async ({ request }: ActionFunctionArgs) => {
//   if (request.method !== 'POST') {
//     return json(
//       { error: { message: 'Method Not Allowed' } },
//       { status: 405 });
//   }

//   if (!Auth.validateToken(request)) {
//     return json({ error: true, message: 'Unauthorized' }, { status: 401 });
//   }

//   switch (request.method) {
//     case 'POST' : {
//       let images: Image | null = null;
//       let error = false;

//       const session = await getSession(
//         request.headers.get('Cookie')
//       );

//       const token = session.get('token');

//       const result = await validator.validate(
//         await request.formData()
//       );

//       if (result.error)
//         return validationError(result.error, result.submittedData);

//       const { name } = result.data;

//       await ofetch(
//         `${process.env.BACKEND_URL}/v1/image`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           },
//           body: {
//             name
//           },
//           parseResponse: JSON.parse
//         })
//         .then((res)=>{
//           images=res;
//         })
//         .catch((err) => {
//           error = true;
//           console.log('err.data: ', err.data);
//         });

//       if (error) {
//         return json({ error: true, message: '/resource/images GET failed' });
//       }

//       console.log(images);

//       return json(images);
//     }
//   }
// };
