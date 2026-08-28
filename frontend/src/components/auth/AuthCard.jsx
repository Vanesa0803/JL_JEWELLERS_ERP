import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";

const AuthCard = () => {
  return (
    <div
      className="
        w-[500px]
        rounded-[28px]
        bg-white/95
        backdrop-blur-sm
        border border-white/30
        shadow-[0_25px_60px_rgba(0,0,0,0.25)]
        p-10
      "
    >
      <LoginHeader />

      <LoginForm />
    </div>
  );
};

export default AuthCard;