import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser } from "../../services/auth.service";
import useAuthStore from "../../store/authStore";


import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

    const [loading, setLoading] = useState(false);

    const login = useAuthStore((state) => state.login);

    const navigate = useNavigate();
    const location = useLocation();

    // If the guard bounced the user here from a page they wanted, go back to it
    // after logging in. Otherwise land on the dashboard.
    const redirectTo = location.state?.from?.pathname || "/dashboard";

    const onSubmit = async (data) => {
  try {
    setLoading(true);

    const response = await loginUser(
      data.email,
      data.password
    );

    login(response.user, response.token);

    toast.success(response.message);

    navigate(redirectTo, { replace: true });

  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";

    toast.error(message);
  } finally {
    setLoading(false);
  }
};
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 space-y-6"
    >
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        icon={Mail}
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
        })}
      />

      <PasswordInput
        label="Password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
        })}
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm font-medium text-[#8A6A1F] hover:text-[#B8860B]"
        >
          Forgot Password?
        </button>
      </div>

      <Button
    type="submit"
    loading={loading}
>
    LOGIN
</Button>

      <p className="text-center text-sm text-[#8A7B6F]">
        Secure • Reliable • Trusted
      </p>
    </form>
  );
};

export default LoginForm;