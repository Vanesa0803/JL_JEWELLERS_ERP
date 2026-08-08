import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label,
  placeholder = "Enter your password",
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#2B221B]">
          {label}
        </label>
      )}

      <div className="flex h-12 items-center rounded-xl border border-[#DDD3C7] bg-white px-4 transition-all duration-200 focus-within:border-[#C89A2B] focus-within:ring-2 focus-within:ring-[#C89A2B]/20">
        <Lock
          size={18}
          className="mr-3 text-[#8A7B6F]"
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-[#A4978D]"
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[#8A7B6F] transition hover:text-[#C89A2B]"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;