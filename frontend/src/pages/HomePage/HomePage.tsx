import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <h1>欢迎使用 TodoList</h1>
      <p>一个简洁的待办事项管理工具</p>
      <Link to="/todos" className="enter-btn">进入待办事项</Link>
    </div>
  );
}

export default HomePage;
