import loginBg from "../../assets/images/auth/login-bg.jpg";

const ShowroomBackground = () => {
  return (
    <div className="absolute inset-0">
      <img
        src={loginBg}
        alt="JL Jewellers Showroom"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default ShowroomBackground;