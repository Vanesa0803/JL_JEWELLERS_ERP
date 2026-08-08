const Button = ({
  children,
  loading = false,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        h-12
        w-full
        rounded-xl
        bg-gradient-to-r
        from-[#B8860B]
        to-[#D4AF37]
        text-white
        font-semibold
        transition-all
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-70
        ${className}
      `}
      {...props}
    >
      {loading ? "Logging in..." : children}
    </button>
  );
};

export default Button;