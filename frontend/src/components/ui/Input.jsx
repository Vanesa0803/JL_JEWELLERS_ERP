import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      icon: Icon,
      type = "text",
      placeholder,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-[#2B221B]">
            {label}
          </label>
        )}

        <div
          className={`
            flex items-center
            rounded-xl
            border border-[#DDD3C7]
            bg-white
            px-4
            transition-all
            duration-200
            focus-within:border-[#C89A2B]
            focus-within:ring-2
            focus-within:ring-[#C89A2B]/20
            ${className}
          `}
        >
          {Icon && (
            <Icon
              size={18}
              className="mr-3 text-[#8A7B6F]"
            />
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className="h-12 w-full bg-transparent outline-none placeholder:text-[#A4978D]"
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;