import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

/**
 * The app shell: fixed sidebar, fixed topbar, and one scrolling content pane.
 *
 * The whole shell is exactly ONE viewport tall (`h-screen`) and refuses to
 * scroll itself (`overflow-hidden`). That is what makes the panes independent:
 * with the outer box unable to grow, the only thing that can scroll is the
 * element that opts in, which is <main> below.
 *
 * It used to be `min-h-screen` with nothing owning the overflow, so the page
 * grew to fit the tallest content and the window scrolled the entire layout —
 * taking the sidebar and topbar up and out of view along with the table you
 * were reading.
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F3EE]">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        {/* shrink-0: the topbar keeps its height instead of being squeezed
            when the content pane is taller than the viewport. */}
        <div className="shrink-0">
          <Topbar />
        </div>

        {/* The only scrolling region. `no-scrollbar` hides the bar itself;
            the wheel, trackpad, keyboard and touch all still work. */}
        <main className="no-scrollbar flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;