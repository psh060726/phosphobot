import { NavLink } from "react-router-dom";

const menu = [
  { path: "/", label: "Dashboard" },
  { path: "/control", label: "Robot Control" },
  { path: "/calibration", label: "Calibration" },
  { path: "/browse", label: "Datasets" },
  { path: "/network", label: "Network" },
  { path: "/admin", label: "Admin" },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-full bg-purple-50 border-r border-purple-200 px-4 py-6">
      {/* 로고 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-700">
          Roboseasy
        </h2>
        <p className="text-xs text-muted-foreground">
          Robot Control Platform
        </p>
      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

