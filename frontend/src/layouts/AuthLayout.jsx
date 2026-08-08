import ShowroomBackground from "../components/auth/ShowroomBackground";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <ShowroomBackground />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Center Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;