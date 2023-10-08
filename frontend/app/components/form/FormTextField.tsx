import { useField } from 'remix-validated-form';

type TextareaTextFieldAttributes =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FormTextFieldProps extends
  React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  textarea?: boolean;
  name: string;
  optional?: boolean;
}

export default function FormTextField({
  label,
  textarea,
  name,
  placeholder,
  optional,
  ...props
}: FormTextFieldProps) {
  const { error, getInputProps } = useField(name);

  return (
    <div className="space-y-2 flex-grow">
      <label htmlFor={name}>{label}<span className='text-black-8'> {optional && '(Optional)'}</span></label>
      <div className="flex flex-col gap-1">
        {
          textarea ? (
            <textarea
              {...getInputProps({ id: name })}
              {...props as TextareaTextFieldAttributes}
              placeholder={placeholder ? placeholder : label}
              className={`rounded-xl ${error ?
                'bg-red-50' : 'bg-[#EDEDED]'} h-32 pl-4 pt-3.5 max-w-[600px]`}
            />
          ) : (
            <input
              {...getInputProps({ id: name })}
              {...props}
              placeholder={placeholder ? placeholder : label}
              className={`${error ? 'bg-red-50' : 'bg-black-2'
              } h-11 pl-4 max-w-[600px] border border-black-5 rounded-[10px]`}
            />
          )
        }
      </div>
      {error && (
        <p className="text-danger flex gap-1 items-center">
          {error}
        </p>
      )}
    </div>
  );
}
