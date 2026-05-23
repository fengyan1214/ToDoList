from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from fastapi import Path, Query, Body
from typing import Annotated
from itertools import count

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

id_counter = count(4)

class ToDoItem(BaseModel):
    id: int 
    title: str
    completed: bool 
    content: str 
    createdAt: datetime
    updatedAt: datetime 

class ToDoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None
    content: str | None = None

class ToDoCreate(BaseModel):
    title: str
    content: str
    completed: bool = False


fake_db: list[ToDoItem] = [
    ToDoItem(
        id=1,
        title="学习Python",
        completed=True,
        content="掌握Python基础语法和常用库",
        createdAt=datetime(2024, 1, 1, 10, 0, 0),
        updatedAt=datetime(2024, 1, 10, 15, 30, 0),
    ),
    ToDoItem(
        id=2,
        title="学习React",
        completed=False,
        content="完成TodoList的前端页面开发，包括增删改查和筛选功能",
        createdAt=datetime(2024, 2, 1, 9, 0, 0),
        updatedAt=datetime(2024, 2, 1, 9, 0, 0),
    ),
    ToDoItem(
        id=3,
        title="学习Vue",
        completed=False,
        content="了解Vue3的组合式API和响应式原理",
        createdAt=datetime(2024, 3, 1, 14, 0, 0),
        updatedAt=datetime(2024, 3, 1, 14, 0, 0),
    ),
]

@app.get("/count")
async def get_count():
    return {"total": len(fake_db),
        "completed": sum(item.completed for item in fake_db),
        "uncompleted": len(fake_db) - sum(item.completed for item in fake_db)}


@app.get("/toDo")
async def get_toDo(completed: Annotated[bool | None, Query()] = None):
    if completed is None:
        return fake_db
    return [item for item in fake_db if item.completed == completed]


@app.get("/toDo/{id}")
async def get_toDo_by_id(id: Annotated[int, Path()]):
    target = next((t for t in fake_db if t.id == id), None)
    if target is None:
        return {"message": "任务不存在"}
    return target


@app.post("/toDo")
async def post_toDo(item: Annotated[ToDoCreate, Body()]):
    new_item = ToDoItem(
        id=next(id_counter),
        title=item.title,
        completed=item.completed,
        content=item.content,
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
    )
    fake_db.append(new_item)
    return new_item


@app.put("/toDo/{id}")
async def put_toDo(id: Annotated[int, Path()], item: Annotated[ToDoUpdate, Body()]):
    target = next((t for t in fake_db if t.id == id), None)
    if target is None:
        return {"message": "任务不存在"}
    update_data = item.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(target, key, value)
    target.updatedAt = datetime.now()
    return target


@app.delete("/toDo/{id}")
async def delete_toDo(id: Annotated[int, Path()]):
    for i, item in enumerate(fake_db):
        if item.id == id:
            fake_db.pop(i)
            return {"message": "success", "deleted_item": item}
    return {"message": "任务不存在"}
