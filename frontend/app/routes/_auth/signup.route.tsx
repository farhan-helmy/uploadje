import type { DataFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import FormButton from '~/components/form/FormButton';
import FormTextField from '~/components/form/FormTextField';
import { Auth } from '~/modules/auth.server';
import { commitSession, getSession } from '~/utils/sessions.server';

export const schema = z.object({
  email: zfd
    .text(z
      .string({ required_error: 'Please enter your email.' })
      .email({ message: 'Please enter a valid email address.' })),
  password: zfd
    .text(z
      .string({ required_error: 'Please enter a password.' })
      .min(6, { message: 'Password must be at least 6 characters.' })),
  confirmPassword: zfd
    .text(z
      .string({ required_error: 'Please enter a password.' })
      .min(6, { message: 'Password must be at least 6 characters.' }))
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password don\'t match',
  path: ['confirmPassword'],
});

const validator = withZod(schema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenValidated = await Auth.validateToken(request);

  if (tokenValidated) {
    return redirect('/apps');
  }

  return ({});
};

export const action = async ({ request }: DataFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const session = await getSession(
        request.headers.get('Cookie')
      );

      const result = await validator.validate(
        await request.formData()
      );

      if (result.error)
        return validationError(result.error, result.submittedData);

      const { email, password, confirmPassword } = result.data;

      const { token } = await Auth.register(email, password, confirmPassword);

      if (!token || token.error) {
        session.flash(
          'error',
          'Failed to register!'
        );

        return json({
          fieldErrors: { password: 'Invalid email or password' },
          repopulateFields: result.submittedData
        }, {
          headers: {
            'Set-Cookie': await commitSession(session),
          }
        });
      }

      session.set('token', token);

      session.flash(
        'globalMessage',
        'Successfully logged in!'
      );

      return redirect('/apps', {
        headers: {
          'Set-Cookie': await commitSession(session),
        }
      });
    }

    default: {
      return json(
        { error: { message: 'Method Not Allowed' } },
        { status: 405 });
    }
  }
};

export default function Page() {
  const actionData: any = useActionData();

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-black-7">To keep your account secure, we’ll send you a code to log in.</p>
      </div>
      <div className="contents">
        <ValidatedForm
          validator={validator}
          method="post"
          className="contents"
          defaultValues={{
            email: actionData?.repopulateFields?.email,
            password: actionData?.repopulateFields?.password,
          }}
        >
          <div className="flex flex-col gap-6">
            <FormTextField
              name="email"
              label="Email"
              placeholder="test@example.com"
            />
            <FormTextField
              name="password"
              label="Password"
              type="password"
            />
            <FormTextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
            />
          </div>
          <FormButton label="Continue" />
        </ValidatedForm>
      </div>
    </>
  );
}
