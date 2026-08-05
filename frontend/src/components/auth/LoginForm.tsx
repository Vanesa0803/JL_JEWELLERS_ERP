import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { loginSchema, type LoginFormData } from "../../validators/loginSchema";
import { loginUser } from "../../services/authService";

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setServerError("");

      const response = await loginUser(data.email, data.password);

      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    } catch (error: any) {
      setServerError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 space-y-6"
    >
      {/* Email */}

      <div className= "flex flex-col items-center justify-center">
        <label className="mb-2 block font-medium text-gray-700">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className="w-120 h-10 rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-[#D4AF37]"
        />

        {errors.email && (
          <p className="mt-2 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}

      <div className= "flex flex-col items-center justify-center">
        <label className="mb-2 block font-medium text-gray-700">
          Password
        </label>

        <div className="relative">
            <div className= "flex flex-col items-center justify-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className="w-120 h-10 rounded-xl border border-gray-300 px-5 py-4 pr-12 outline-none transition focus:border-[#D4AF37]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Backend Error */}

      {serverError && (
        <div className="rounded-lg bg-red-100 p-3 text-center text-red-600">
          {serverError}
        </div>
      )}

      {/* Forgot Password */}

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-[#B8860B] hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}


      <div className= "flex flex-col items-center justify-center">
      <button
        type="submit"
        disabled={loading}
        className="w-120 h-10 rounded-2xl bg-[#D4AF37] py-4 font-semibold text-white transition hover:bg-[#C89B2C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      </div>
    </form>
  );
};

export default LoginForm;
