import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import request from "@/utils/request";
import "./TodoPage.css";

interface ToDoItem {
  id?: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  content: string;
}
interface countInfo {
  total: number;
  completed: number;
  uncompleted: number;
}

function TodoPage() {
  const [toDoList, setToDoList] = useState<ToDoItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<ToDoItem> | null>(
    null,
  );
  const [countInfo, setCountInfo] = useState<countInfo>({
    total: 0,
    completed: 0,
    uncompleted: 0,
  });

  async function fetchCountInfo() {
    const data = await request.get("/count");
    setCountInfo(data);
  }

  async function fetchData(completed: boolean | null = null) {
    const params = completed !== null ? { completed } : {};
    const data = await request.get("/toDo", { params });
    setToDoList(data);
  }

  function initData() {
    fetchData();
    fetchCountInfo();
    setCurrentItem(null);
  }

  async function handleDelete(id: number) {
    await request.delete("/toDo/" + id);
    initData();
  }
  async function handleFinish(id: number) {
    await request.put("/toDo/" + id, {
      completed: !toDoList.find((item) => item.id === id)?.completed,
    });
    initData();
  }
  async function handleAdd(item: Partial<ToDoItem>) {
    await request.post("/toDo", {
      title: item.title || "",
      content: item.content || "",
      completed: item.completed || false,
    });
    initData();
  }
  async function handleUpdate(item: Partial<ToDoItem>) {
    await request.put("/toDo/" + item.id, {
      title: item.title || "",
      content: item.content || "",
      completed: item.completed || false,
    });
    initData();
  }

  async function handleSubmit(item: Partial<ToDoItem>) {
    if (item.id === undefined) {
      await handleAdd(item);
    } else {
      await handleUpdate(item);
    }
  }

  useEffect(() => {
    initData();
  }, []);

  return (
    <div className="todo-page">
      <Link to="/" className="back-link">
        ← 返回首页
      </Link>
      <h1 className="title">我的待办事项</h1>
      <div className="main-content">
        <div className="toDoListPanel">
          <div className="tab-panel">
            <label onClick={() => fetchData(null)} htmlFor="all">
              <span>全部</span>({countInfo.total})
              <input type="radio" name="tab" id="all" />
            </label>
            <label onClick={() => fetchData(true)} htmlFor="completed">
              <span>已完成</span>({countInfo.completed})
              <input type="radio" name="tab" id="completed" />
            </label>
            <label onClick={() => fetchData(false)} htmlFor="uncompleted">
              <span>未完成</span>({countInfo.uncompleted})
              <input type="radio" name="tab" id="uncompleted" />
            </label>
          </div>
          <div className="toDoList">
            {toDoList.map((item) => {
              return (
                <div
                  onClick={() => setCurrentItem(item)}
                  key={item.id}
                  className="toDoItem"
                >
                  <div className="finish">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleFinish(item.id!)}
                    />
                    <span
                      style={{
                        color: item.completed ? "green" : "red",
                      }}
                      className="status"
                    >
                      {item.completed ? "已完成" : "未完成"}
                    </span>
                  </div>
                  <div className="content-panel">
                    <div className="toDoTitle">{item.title}</div>
                    <div className="toDoContent">{item.content}</div>
                    <div className="createTime">
                      创建于：{new Date(item.createdAt).toLocaleString()}
                    </div>
                    <div className="updateTime">
                      更新于：{new Date(item.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="operation">
                    <button onClick={() => handleDelete(item.id!)}>删除</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="input-panel">
          <button className="add-button" onClick={() => setCurrentItem({})}>
            添加
          </button>
          <input
            value={currentItem?.title || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, title: e.target.value })
            }
            className="input-title"
            type="text"
            placeholder="输入待办事项标题"
          />
          <textarea
            value={currentItem?.content || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, content: e.target.value })
            }
            className="input-description"
            placeholder="输入待办事项内容"
          ></textarea>
          <button
            onClick={() => currentItem && handleSubmit(currentItem)}
            className="add-button"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
