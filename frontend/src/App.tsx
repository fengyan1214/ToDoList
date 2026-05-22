import { useState, useEffect, useMemo } from "react";

import "./App.css";

interface ToDoItem {
  id: number;
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
  const [currentItem, setCurrentItem] = useState<ToDoItem | null>(null);
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
  useEffect(() => {
    fetchCountInfo();
  }, []);

  async function fetchData(completed: boolean | null = null) {
    let url = baseUrl + "/toDo";
    if (completed !== null) {
      url += `?completed=${completed}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setToDoList(data);
    setCurrentItem(null);
  }
  async function getToItem(id: number) {
    const response = await fetch(baseUrl + "/toDo/" + id);
    const data = await response.json();
    console.log(data);
    return data;
  }
  async function handleDelete(id: number) {
    const response = await fetch(baseUrl + "/toDo/" + id, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    fetchData();
  }
  async function handleFinish(id: number) {
    const response = await fetch(baseUrl + "/toDo/" + id, {
      method: "PUT",
      body: JSON.stringify({
        completed: !toDoList.find((item) => item.id === id)?.completed,
      }),
    });
    const data = await response.json();
    console.log(data);
    fetchData();
  }
  async function handleAdd(item: ToDoItem) {
    const response = await fetch(baseUrl + "/toDo", {
      method: "POST",
      body: JSON.stringify(item),
    });
    const data = await response.json();
    console.log(data);
    fetchData();
  }
  async function handleUpdate(item: ToDoItem) {
    const response = await fetch(baseUrl + "/toDo/" + item.id, {
      method: "PUT",
      body: JSON.stringify(item),
    });
    const data = await response.json();
    console.log(data);
    fetchData();
  }

  async function handleSubmit(item: ToDoItem) {
    if (item.id === 0) {
      await handleAdd(item);
    } else {
      await handleUpdate(item);
    }
  }

  useEffect(() => {
    fetchData();
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
                </div>
              );
            })}
          </div>
        </div>
        <div className="input-panel">
          <input
            value={currentItem?.title || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem!, title: e.target.value })
            }
            className="input-title"
            type="text"
            placeholder="输入待办事项标题"
          />
          <textarea
            value={currentItem?.content || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem!, content: e.target.value })
            }
            className="input-description"
            placeholder="输入待办事项内容"
          ></textarea>
          <button
            onClick={() => handleSubmit(currentItem!)}
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
