import logo from "../../assets/logos/jl-logo.png";

const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={logo}
        alt="JL Jewellers"
        className="w-52 object-contain"
      />
    </div>
  );
};

export default LoginHeader;