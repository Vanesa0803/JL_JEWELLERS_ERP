import LoginCard from "../../components/auth/LoginCard";

const Login = () => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Login Card */}
      <div className="relative z-10">
        <LoginCard />
      </div>
    </div>
  );
};

export default Login;