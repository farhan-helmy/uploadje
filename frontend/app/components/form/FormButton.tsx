import { useIsSubmitting } from 'remix-validated-form';

interface FormButtonProps extends
React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function FormButton({ label, ...props }: FormButtonProps = {}) {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      {...props}
      disabled={isSubmitting}
      className="transition-all hover:scale-[1.02] active:scale-[0.97] rounded-xl bg-gradient-to-b from-[#F15757] to-[#DA0C0C] text-white text-lg font-medium h-12 px-6 disabled:opacity-60"
    >
      {isSubmitting ? 'Loading...' : label ?? 'Button'}
    </button>
  );
}
