import { Outlet, NavLink } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          首页
        </NavLink>
        <NavLink
          to="/todos"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          待办事项
        </NavLink>
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
