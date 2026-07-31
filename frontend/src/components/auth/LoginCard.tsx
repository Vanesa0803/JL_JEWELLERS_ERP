import Logo from "./Logo";
import LoginForm from "./LoginForm";

const LoginCard = () => {
  return (
    <div
  className="
  w-[520px]
  h-[640px]
  rounded-[32px]
  border
  border-gray-200
  bg-white
  shadow-2xl
  px-12
  py-14
  flex
  flex-col
  justify-center
  "
>
      <Logo />

      <LoginForm />

      <div className="mt-10 text-center text-sm text-gray-500">
        © 2026 Chepuri's JL Jewellers
      </div>
    </div>
  );
};

export default LoginCard;