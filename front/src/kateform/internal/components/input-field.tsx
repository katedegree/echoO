export interface InputFieldProps {
  startContent: React.ReactNode;
  endContent: React.ReactNode;
  actionContent?: React.ReactNode;
  children?: React.ReactNode;
}

export function InputField({
  startContent,
  endContent,
  actionContent,
  children,
}: InputFieldProps) {
  return (
    <label className="rounded-input text-value bg-flat hover:bg-flat-hover overflow-hidden focus-within:bg-flat-hover px-lg flex items-center gap-md">
      {startContent && <div className="text-placeholder">{startContent}</div>}
      <div className="w-full py-md overflow-hidden">{children}</div>
      {endContent && <div className="text-placeholder">{endContent}</div>}
      {actionContent}
    </label>
  );
}
