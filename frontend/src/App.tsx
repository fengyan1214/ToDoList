import { useState, useEffect } from "react";

import "./App.css";

interface ToDoItem {
  id?: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  content: string;
}
interface countInfo {
  total: number;
  completed: number;
  uncompleted: number;
}
const baseUrl = "http://localhost:8000";
function App() {
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
    const response = await fetch(baseUrl + "/count");
    const data = await response.json();
    setCountInfo(data);
  }

  async function fetchData(completed: boolean | null = null) {
    let url = baseUrl + "/toDo";
    if (completed !== null) {
      url += `?completed=${completed}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setToDoList(data);
  }

  function initData() {
    fetchData();
    fetchCountInfo();
    setCurrentItem(null);
  }

  async function handleDelete(id: number) {
    const response = await fetch(baseUrl + "/toDo/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      alert("删除失败");
      return;
    }
    initData();
    fetchCountInfo();
  }
  async function handleFinish(id: number) {
    const response = await fetch(baseUrl + "/toDo/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: !toDoList.find((item) => item.id === id)?.completed,
      }),
    });
    if (!response.ok) {
      alert("操作失败");
      return;
    }
    initData();
  }
  async function handleAdd(item: Partial<ToDoItem>) {
    await fetch(baseUrl + "/toDo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title || "",
        content: item.content || "",
        completed: item.completed || false,
      }),
    });
    initData();
  }
  async function handleUpdate(item: Partial<ToDoItem>) {
    const response = await fetch(baseUrl + "/toDo/" + item.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title || "",
        content: item.content || "",
        completed: item.completed || false,
      }),
    });
    if (!response.ok) {
      alert("更新失败");
      return;
    }
    const data = await response.json();
    console.log(data);
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
    <div className="container">
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
                      onChange={() => handleFinish(item.id)}
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
                      创建于：{item.createdAt.toLocaleString()}
                    </div>
                    <div className="updateTime">
                      更新于：{item.updatedAt.toLocaleString()}
                    </div>
                  </div>
                  <div className="operation">
                    <button onClick={() => handleDelete(item.id)}>删除</button>
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

export default App;
