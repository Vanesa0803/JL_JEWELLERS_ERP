const LoginForm = () => {
  return (
    <form>
      <div className= "flex flex-col items-center justify-center  gap-4">
        <div>
        <label className="block font-medium text-gray-700">
          Email ID
        </label>

        <input
          type="text"
          placeholder="Enter Email-id"
          className="
          w-110
          h-10
          
          rounded-2xl
          border
          border-gray-300
          bg-white
          px-5
          py-5
          outline-none
          transition
          focus:border-[#D4AF37]
          "
        />
        </div>
      

      <div>
        <label className="mb-2 block font-medium text-gray-700">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter Password"
          className="
          w-110
          h-10
          rounded-2xl
          border
          border-gray-300
          bg-white
          px-5
          py-5
          outline-none
          transition
          focus:border-[#D4AF37]
          "
        />
      </div>
      

      <div className="flex justify-end">
        <button
          type="button"
          className=" text-sm text-[#B8860B] hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button
        className="
        w-100
        h-10
        rounded-2xl
        bg-[#D4AF37]
        py-5
        font-semibold
        text-white
        transition
        hover:bg-[#C89B2C]
        "
      >
        Login
      </button>

      </div>
    </form>
  );
};

export default LoginForm;