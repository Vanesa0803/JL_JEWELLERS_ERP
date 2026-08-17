import emblem from "../../assets/logos/jl-emblem.png";

/**
 * The login screen's masthead.
 *
 * Uses the emblem rather than the older jl-logo.png: that file bakes its own
 * cream background into the image, which only ever matched one page colour,
 * and it is 1.2 MB against 210 KB here. The emblem is transparent, so it sits
 * on whatever the login screen's background happens to be.
 *
 * The wordmark is set in real text below it rather than being part of the
 * image. It stays sharp at any zoom, it can be read by a screen reader, and
 * the shop name is a string somebody can change without opening an image
 * editor.
 */
const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={emblem}
        alt=""
        aria-hidden="true"
        className="w-36 object-contain sm:w-40"
      />

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#2B2622]">
        Chepuri&rsquo;s JL Jewellers
      </h1>

      <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[#A98A5F]">
        ERP System
      </p>
    </div>
  );
};

export default LoginHeader;
