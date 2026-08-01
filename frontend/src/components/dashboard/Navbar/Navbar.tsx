import { Bell, Search, ChevronDown } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-[70px] bg-[#FCFAF6] border-b border-[#E7DED0] px-10 flex items-center justify-end gap-8">

        

     
      {/* Search */}

<div className="relative w-[450px] ">
  <Search
    size={20}
    className="absolute left-5 top-[50%] -translate-y-1/2 text-gray-400 z-10"
  />

  <input
    type="text"
    placeholder="Search customers, bills..."
    style={{ paddingLeft: "56px" }}
    className="w-full h-12 rounded-full border border-[#E8DFD2] bg-white pr-5 text-[16px] placeholder:text-gray-400"
  />
</div>
      {/* Right */}
      <div className="flex items-center gap-8">

        <button className="relative">

          <Bell size={25} className="text-[#3C1414]" />

          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-4">

          <div className="h-12 w-12 rounded-full bg-[#D4AF37] flex items-center justify-center font-semibold text-white text-lg">
            A
          </div>

          <div className="leading-tight">

            <p className="font-semibold text-[#3C1414]">
              Admin
            </p>

            <p className="text-sm text-gray-500">
              Administrator
            </p>

          </div>

          <ChevronDown size={15} className="text-gray-500" />

        </div>

      </div>

    </header>
  );
};

export default Navbar;