# TodoList 需求文档

> 本文档专为 **React 初学者 + 后端零基础** 编写，用大白话解释每个概念。

---

## 一、先看看最终要做成什么样

### 1.1 页面长这样

打开浏览器，你会看到一个页面，从上到下分成四个区域：

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              📋 我的待办事项                       │  ← 区域①：标题栏
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────────────────────┐ ┌──────────┐  │
│   │  输入你想做的事情...          │ │  添 加   │  │  ← 区域②：输入区
│   └──────────────────────────────┘ └──────────┘  │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   [ 全部(3) ]   [ 未完成(2) ]   [ 已完成(1) ]     │  ← 区域③：筛选栏
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │ ☐  学习 FastAPI                     🗑️   │   │
│   │    掌握后端开发的基础知识                  │   │
│   │    创建于 2024-01-01 10:00               │   │
│   └──────────────────────────────────────────┘   │
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │ ☐  写 React 组件                     🗑️   │   │  ← 区域④：任务列表
│   │    完成 TodoList 的前端页面               │   │
│   │    创建于 2024-01-01 11:00               │   │
│   └──────────────────────────────────────────┘   │
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │ ☑  搭建项目环境                      🗑️   │   │
│   │    初始化前端和后端项目                    │   │
│   │    创建于 2024-01-01 09:00               │   │
│   └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 1.2 页面交互行为（用户能做什么）

| 你在页面上的操作       | 会发生什么                               |
| ---------------------- | ---------------------------------------- |
| 在输入框打字，点"添加" | 输入框下方立刻出现一条新任务             |
| 点任务左边的 ☐         | 勾变成 ☑，文字出现 ~~删除线~~，变灰色    |
| 点任务右边的 🗑️        | 这条任务直接消失                         |
| 点"未完成"按钮         | 只显示还没做完的任务                     |
| 点"已完成"按钮         | 只显示已经做完的任务                     |
| 点"全部"按钮           | 显示所有任务                             |
| 刷新浏览器页面         | 所有任务还在（因为数据存在后端数据库里） |

---

## 二、这个项目到底要实现什么功能

### 功能清单（一共就 4 件事）

#### 功能 1：添加任务

- 用户在输入框里打字
- 点击"添加"按钮
- 新任务出现在列表最上面
- 输入框自动清空，方便继续输入

#### 功能 2：完成任务

- 用户点击任务左边的 checkbox（☐）
- 任务变成已完成状态（☑）
- 文字自动加上删除线，颜色变灰
- 再次点击可以取消完成，恢复原样

#### 功能 3：删除任务

- 用户点击任务右边的删除按钮（🗑️）
- 任务从列表中消失

#### 功能 4：筛选任务

- 页面顶部有三个按钮：全部 / 未完成 / 已完成
- 点击不同按钮，列表只显示对应状态的任务
- 按钮上显示对应数量，比如"未完成(2)"

---

## 三、后端是什么？为什么需要它？

### 3.1 用大白话解释

想象你写了一个纯前端页面，所有任务存在浏览器内存里。**一刷新页面，任务全没了**。

后端的作用就是：**帮你把数据永久保存下来**。你把任务交给后端，后端存到数据库（一个文件）里。下次打开页面，后端从数据库里读出来还给你。

```
浏览器（前端）  ──请求──▶  后端服务（FastAPI）  ──读写──▶  数据库（SQLite 文件）
               ◀──响应──                        ◀──数据──
```

### 3.2 什么是 API？

API 就是后端暴露出来的"服务窗口"。前端想做什么，就去对应的窗口喊一声：

| 前端想做什么 | 去哪个窗口喊          | 喊什么内容                 |
| ------------ | --------------------- | -------------------------- |
| 获取所有任务 | `GET /api/todos`      | 不用喊内容，直接要         |
| 创建新任务   | `POST /api/todos`     | 喊："标题是xxx，描述是xxx" |
| 修改任务     | `PUT /api/todos/1`    | 喊："把1号任务改成已完成"  |
| 删除任务     | `DELETE /api/todos/1` | 喊："删掉1号任务"          |

### 3.3 什么是数据库？

数据库就是一个**专门存数据的文件**。本项目用 SQLite，它就是一个 `.db` 文件，不需要安装任何数据库软件。

数据库里有一张叫 `todos` 的表，像 Excel 表格一样：

| id  | title         | description  | is_completed | created_at       |
| --- | ------------- | ------------ | ------------ | ---------------- |
| 1   | 学习 FastAPI  | 掌握后端开发 | false        | 2024-01-01 10:00 |
| 2   | 写 React 组件 | 完成前端页面 | false        | 2024-01-01 11:00 |
| 3   | 搭建项目环境  | 初始化项目   | true         | 2024-01-01 09:00 |

- **id**：每条任务的唯一编号，自动生成
- **title**：任务标题，必填
- **description**：任务描述，可选的
- **is_completed**：是否完成，默认 false（未完成）
- **created_at**：创建时间，自动记录

### 3.4 后端代码会做什么？

后端代码其实就做这几件事：

1. **接收请求** — 前端发来请求，后端收到
2. **处理数据** — 该存的存，该查的查，该改的改，该删的删
3. **返回结果** — 把处理结果发回给前端

比如前端说"我要所有任务"，后端就去数据库查，查完把结果打包成 JSON 发回去。

---

## 四、前端 vs 后端：两种完全不同的开发思维

> ⭐ **这是本文档最重要的一个章节。理解了它，你就知道后端该怎么入手了。**

### 4.1 前端开发思维：由外向内（从页面倒推）

```
第一步：画页面布局  ──▶  第二步：拆成组件  ──▶  第三步：写组件代码  ──▶  第四步：接入数据
   （大框框）            （Header/List）         （JSX + CSS）          （调API）
```

前端开发者看到设计稿，先想"这个页面可以拆成几个区域？"然后从最大的区域开始写，一层层细化。**视觉是第一驱动力**。

### 4.2 后端开发思维：由内向外（从数据推导）

```
第一步：定义数据模型  ──▶  第二步：配置数据库  ──▶  第三步：写业务逻辑  ──▶  第四步：暴露API接口
   （数据长什么样）         （数据存哪里）          （增删改查怎么干）       （让前端能调用）
```

后端开发者没有任何"页面"可看。只能从**数据**出发思考："系统里有什么数据？数据之间什么关系？怎么存、怎么查？"

### 4.3 用一张表对比两种思维

|                | 前端                         | 后端                                |
| -------------- | ---------------------------- | ----------------------------------- |
| **出发点**     | 用户看到的页面               | 系统要管理的数据                    |
| **第一个问题** | "这个页面有哪些区块？"       | "这个系统有哪些数据实体？"          |
| **核心关注**   | 用户体验、交互、视觉效果     | 数据一致性、安全性、性能            |
| **开发顺序**   | 大布局 → 小组件 → 数据       | 数据模型 → 数据库 → 逻辑 → API      |
| **调试方式**   | 打开浏览器看页面效果         | 用 Swagger 文档 / curl 发请求看响应 |
| **"对"的标准** | 页面看起来对不对、操作顺不顺 | 返回的数据对不对、逻辑有没有漏洞    |

### 4.4 以一个具体需求为例

需求是"用户能添加一条待办任务"：

| 步骤 | 前端想的是...                      | 步骤 | 后端想的是...                          |
| ---- | ---------------------------------- | ---- | -------------------------------------- |
| 1    | 页面上要有一个输入框和一个按钮     | 1    | 数据库里需要一张 todos 表              |
| 2    | 输入框放上面，按钮放右边           | 2    | 这张表有哪些列？每列什么类型？         |
| 3    | 按钮点了要收集输入框的文字         | 3    | 如何建立数据库连接？                   |
| 4    | 把文字发给后端的 POST /api/todos   | 4    | 收到 POST 请求后，怎么校验数据合法性？ |
| 5    | 后端返回成功后，把新任务加到列表里 | 5    | 数据合法的话，怎么写入数据库？         |
| 6    | 输入框清空                         | 6    | 写入成功后，把新记录返回给前端         |

**看到了吗？同一个需求，前端从"用户怎么操作"出发，后端从"数据怎么存储"出发。**

---

## 五、前端要写哪些代码

### 5.1 文件分工

```
frontend/src/
├── types/
│   └── todo.ts          ← 定义"任务"长什么样（TypeScript 类型）
├── services/
│   └── api.ts           ← 封装所有 API 请求（跟后端对话的代码）
├── components/
│   ├── TodoInput.tsx     ← 输入框 + 添加按钮
│   ├── TodoFilter.tsx    ← 三个筛选按钮
│   ├── TodoItem.tsx      ← 单条任务的展示
│   └── TodoList.tsx      ← 任务列表（组合多个 TodoItem）
├── App.tsx               ← 主页面，把所有组件拼起来
├── App.css               ← 样式
└── main.tsx              ← 入口文件（已有，不用改）
```

### 5.2 每个组件负责什么

| 组件         | 职责              | 简单理解                                 |
| ------------ | ----------------- | ---------------------------------------- |
| `TodoInput`  | 输入框 + 添加按钮 | 用户打字、点添加的地方                   |
| `TodoFilter` | 三个筛选按钮      | 全部/未完成/已完成 切换                  |
| `TodoItem`   | 一条任务的展示    | checkbox + 标题 + 描述 + 时间 + 删除按钮 |
| `TodoList`   | 任务列表容器      | 把多条 TodoItem 排成一列                 |
| `App`        | 总管              | 管理所有数据，分发给子组件               |

### 5.3 数据怎么在组件间流动

```
App（总管，持有所有任务数据）
 │
 ├──▶ TodoInput（接收"添加任务"的方法）
 │     用户点添加 → 调用 App 给的 addTodo 方法
 │
 ├──▶ TodoFilter（接收当前筛选状态 + 切换方法）
 │     用户点筛选 → 调用 App 给的 setFilter 方法
 │
 └──▶ TodoList（接收筛选后的任务列表）
        │
        └──▶ TodoItem × N（每条任务接收自己的数据 + 操作方法）
              用户点完成 → 调用 App 给的 toggleTodo 方法
              用户点删除 → 调用 App 给的 deleteTodo 方法
```

**核心思想**：所有数据都在 `App` 里管，子组件只负责展示和触发操作，不自己存数据。

---

## 六、后端要写哪些代码（详解）

### 6.1 文件分工

```
backend/
├── app/
│   ├── main.py           ← 应用入口，启动服务、注册路由、配置 CORS
│   ├── database.py       ← 数据库连接配置
│   ├── models.py         ← 数据库表结构定义（SQLAlchemy 模型）
│   ├── schemas.py        ← 数据校验规则（Pydantic 模型）
│   └── routers/
│       └── todos.py      ← 所有 API 接口的实现（增删改查）
└── requirements.txt      ← Python 依赖列表
```

### 6.2 每个文件负责什么 + 为什么需要它

| 文件               | 职责       | 大白话解释                         | 为什么需要它？                                                                  |
| ------------------ | ---------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| `main.py`          | 启动服务   | "服务器开机！监听 8000 端口！"     | 这是 FastAPI 的入口，所有请求都从这里进来，然后把请求分发给对应的路由           |
| `database.py`      | 数据库连接 | "数据库文件在哪？怎么连？"         | 每次请求都要读写数据库，但不需要每次都新建连接。用"会话"（Session）管理链接复用 |
| `models.py`        | 表结构     | "todos 表有哪些列？每列什么类型？" | SQLAlchemy 用 Python 类来映射数据库表，写完这个，数据库表就自动建好了           |
| `schemas.py`       | 数据校验   | "前端发来的数据格式对不对？"       | FastAPI 的核心机制：前端发来的 JSON 先经过 Pydantic 校验，不合法就直接拒绝      |
| `routers/todos.py` | API 逻辑   | "收到请求后具体干什么？"           | 这里写真正的业务逻辑：查数据库、改数据、删数据等。和路由路径绑定                |

### 6.3 这些文件是怎么协作的？（以"添加任务"为例）

```
一个 POST /api/todos 请求走过的完整路径：

第1站：main.py
  "有请求来了！路径是 /api/todos，方法是 POST，
   看看谁注册了这个路由？哦，是 routers/todos.py，交给你处理！"
        │
        ▼
第2站：schemas.py（数据校验关卡）
  "让我检查一下前端发来的 JSON：
   title 必须存在且是字符串 ✓
   description 可选的字符串 ✓
   都通过了，放行！"
        │
        ▼
第3站：routers/todos.py（业务逻辑）
  "数据校验通过了，我要干活了：
   1. 创建一个新的 TodoModel 对象
   2. 通过 database.py 提供的会话写入数据库
   3. 把写入后的数据打包返回"
        │
        ▼
第4站：models.py（数据库映射）
  "我知道 todos 表的结构，帮 routers 把 Python 对象
   翻译成数据库能理解的 SQL 语句"
        │
        ▼
第5站：database.py（执行 SQL）
  "我连上数据库了，执行 SQL，数据写入成功！"
        │
        ▼
第6站：返回给 main.py → 返回给前端
  {"id": 4, "title": "学Python", "is_completed": false, ...}
```

### 6.4 后端开发的核心三板斧

理解了这三个概念，FastAPI 开发就懂了大半：

**① Pydantic Schema（数据校验）** — 类似前端的 TypeScript 类型

```python
# 前端发来的数据必须符合这个格式，否则 FastAPI 自动返回 422 错误
class TodoCreate(BaseModel):
    title: str           # 必填，必须是字符串
    description: str = ""  # 可选，默认空字符串
```

**② SQLAlchemy Model（数据库映射）** — 让 Python 对象和数据库表同步

```python
# 这个 Python 类 = 数据库里的 todos 表
class Todo(Base):
    __tablename__ = "todos"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    is_completed: Mapped[bool] = mapped_column(default=False)
```

**③ Dependency Injection（依赖注入）** — FastAPI 帮你自动准备工具

```python
# 你写一个函数获取数据库会话，FastAPI 自动在每次请求时调用它
def get_db():
    db = SessionLocal()
    try:
        yield db    # 把数据库连接交给路由函数
    finally:
        db.close()  # 请求结束后自动关闭

# 路由函数里直接用，FastAPI 会自动调用 get_db()
@router.post("/")
def create_todo(todo: TodoCreate, db = Depends(get_db)):
    ...
```

---

## 七、开发顺序（跟着做就行）

### 思路：先写后端（让 API 能跑），再写前端（让页面能看），最后联调

为什么要先写后端？因为：

- 后端是数据的"源头"和"管理者"
- API 写完后，可以先用 Swagger 文档独立测试，不需要前端
- 前端写完后直接对接已有的 API，不容易乱

### 阶段一：搭建后端项目骨架

#### 步骤 1：创建目录结构和虚拟环境

```
backend/
├── app/
│   ├── __init__.py       ← 让 app 成为一个 Python 包
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   └── schemas.py
└── requirements.txt
```

**为什么要先建目录？** 良好的目录结构让代码各司其职。数据库相关的放 database.py，表结构放 models.py，不要把所有代码堆在 main.py 里。

#### 步骤 2：写 `database.py` — 配置数据库连接

<details>
<summary>📝 这个文件要写什么？（点击展开）</summary>

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

SQLALCHEMY_DATABASE_URL = "sqlite:///./todos.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass
```

</details>

**为什么这一步在 models 前面？** 数据库连接是所有操作的前提。先告诉系统"数据库文件在哪、怎么连"，后面 models.py 才能用这个连接创建表。

#### 步骤 3：写 `models.py` — 定义数据表结构

<details>
<summary>📝 这个文件要写什么？（点击展开）</summary>

```python
from datetime import datetime
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(500), default="")
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
```

</details>

**为什么这一步在 schemas 前面？** 模型（Model）描述的是"数据在数据库里怎么存"，Schema 描述的是"数据在 API 之间怎么传"。先有存储结构，再有传输格式。

#### 步骤 4：写 `schemas.py` — 定义数据校验规则

<details>
<summary>📝 这个文件要写什么？（点击展开）</summary>

```python
from datetime import datetime
from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    description: str = ""

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = None

class TodoResponse(TodoBase):
    id: int
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True  # 允许从 ORM 对象转换
```

</details>

**为什么要分 TodoCreate / TodoUpdate / TodoResponse？**

- **TodoCreate**：创建时只需要 title 和 description（id 和时间由后端生成）
- **TodoUpdate**：修改时所有字段都是可选的（用户可能只改标题不改描述）
- **TodoResponse**：返回给前端时要包含所有字段（包括自动生成的 id 和 created_at）

这就是**数据校验**的核心：不同场景用的数据格式不同，要分别定义。

#### 步骤 5：写 `routers/todos.py` — 实现 API 业务逻辑

<details>
<summary>📝 这个文件要写什么？（点击展开）</summary>

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(prefix="/api/todos", tags=["todos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.TodoResponse])
def get_todos(is_completed: bool | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Todo)
    if is_completed is not None:
        query = query.filter(models.Todo.is_completed == is_completed)
    return query.all()

@router.post("/", response_model=schemas.TodoResponse)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = models.Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.put("/{todo_id}", response_model=schemas.TodoResponse)
def update_todo(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="任务不存在")
    for key, value in todo.model_dump(exclude_unset=True).items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.delete("/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="任务不存在")
    db.delete(db_todo)
    db.commit()
    return {"message": "删除成功"}
```

</details>

**为什么这个文件放在最后写？** 因为它依赖前面所有文件：需要 models 定义的表结构、需要 schemas 定义的校验规则、需要 database 提供的数据库连接。**这就是"由内向外"：先有基础设施，再有业务逻辑。**

#### 步骤 6：写 `main.py` — 把所有东西串起来

<details>
<summary>📝 这个文件要写什么？（点击展开）</summary>

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import todos

Base.metadata.create_all(bind=engine)  # 启动时自动建表

app = FastAPI(title="TodoList API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 只允许前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)
```

</details>

**为什么 main.py 最后写？** 它只是一个"组装者"：把所有分散的模块（数据库、路由、CORS 配置）组装成一个可运行的应用。就像装电脑，先要有 CPU、内存、硬盘，最后才组装成整机。

#### 步骤 7：用 Swagger 文档测试

启动后端后，打开 `http://localhost:8000/docs`，你会看到 FastAPI 自动生成的交互式 API 文档。**这是后端开发最大的调试利器**——不需要写前端，直接在网页上测试所有接口。

---

### 阶段二：搭建前端（让页面能看）

1. 安装 axios：`npm install axios`
2. 写 `types/todo.ts` — 定义 Task 类型（对应后端的 TodoResponse）
3. 写 `services/api.ts` — 封装四个 API 调用函数
4. 写 `TodoInput.tsx` — 输入框组件
5. 写 `TodoItem.tsx` — 单条任务组件
6. 写 `TodoFilter.tsx` — 筛选按钮组件
7. 写 `TodoList.tsx` — 任务列表组件
8. 写 `App.tsx` — 组装所有组件，管理数据
9. 写 `App.css` — 美化样式

> 前端开发顺序遵循"由外向内"：先写底层类型和 API 封装，再写小组件，最后拼装。

---

### 阶段三：联调测试

1. 启动后端（`uvicorn app.main:app --reload`）
2. 启动前端（`npm run dev`）
3. 在页面上添加、完成、删除、筛选任务
4. 刷新页面，确认数据还在

**如果出问题怎么排查？**

- 打开浏览器 F12 → Network 标签，看请求有没有发出去
- 如果状态码是 4xx/5xx，看后端终端的报错信息
- 如果状态码是 200 但数据不对，检查前后端字段名是否一致

---

## 八、你会学到什么

### React 方面

- 函数组件怎么写
- `useState` 怎么管理状态
- `useEffect` 怎么在页面加载时请求数据
- 父子组件怎么传数据（props）
- axios 怎么发 HTTP 请求

### FastAPI 方面

- 怎么定义一个 API 接口
- 怎么接收前端发来的数据
- 怎么操作数据库（增删改查）
- 怎么处理跨域问题（CORS）
- Pydantic 怎么做数据校验
- **依赖注入（Depends）是什么，为什么要用它**
- **SQLAlchemy ORM 怎么把 Python 对象映射到数据库表**
- **一个请求从进来到出去的完整生命周期**

### 全栈方面

- 前后端是怎么通过 HTTP 通信的
- JSON 格式的数据怎么传递
- 一个完整的请求-响应周期是怎样的
- **前端和后端的开发思维有什么本质区别**
- **如何独立调试后端（不需要前端就能测）**

---

## 九、快速启动命令

### 后端

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

启动后：

- 前端页面：`http://localhost:5173`
- 后端 API 文档：`http://localhost:8000/docs`（FastAPI 自动生成的，可以直接在网页上测试接口！）

---

## 十、常见疑问解答

### Q1：为什么后端文件要分这么细？不能全写在一个文件里吗？

可以，但不好。分开的好处：

- **出 bug 时定位快**：数据库问题去 database.py，校验问题去 schemas.py
- **改需求时影响小**：要加一个字段？改 models.py 和 schemas.py，逻辑不用动
- **这是行业惯例**：几乎所有正式项目的后端都是这样组织的

### Q2：schemas 和 models 有什么区别？看起来很重复

|            | models.py（SQLAlchemy）         | schemas.py（Pydantic）                      |
| ---------- | ------------------------------- | ------------------------------------------- |
| 用途       | 定义数据库表结构                | 定义 API 输入输出的数据格式                 |
| 面向       | 数据库                          | 前端/客户端                                 |
| 例子       | 这条数据的 id 是主键自增的      | 创建任务时 id 不需要传（自动生成）          |
| 为什么分开 | 数据库结构和 API 接口不应该绑定 | 以后换数据库不用改 API，换 API 不用改数据库 |

### Q3：FastAPI 的 `Depends` 是什么？看得一头雾水

`Depends` 是 FastAPI 的"自动准备工具"。你可以理解为：

```python
# 不用 Depends 的写法（每次都要手动获取和关闭数据库连接）
@router.get("/")
def get_todos():
    db = SessionLocal()          # 手动获取
    try:
        result = db.query(...)    # 干活
        return result
    finally:
        db.close()               # 手动关闭（不能忘！）

# 用 Depends 的写法（FastAPI 自动帮你管理）
@router.get("/")
def get_todos(db = Depends(get_db)):
    return db.query(...)          # 干活就行，获取和关闭都是自动的
```

**类比**：就像你去餐厅吃饭，`Depends` 是服务员——你只需要点菜（写业务逻辑），进门（获取连接）和收盘子（关闭连接）都是服务员帮你做的。

### Q4：后端开发完怎么测？必须等前端写完吗？

**不需要！** FastAPI 自带 Swagger 文档（`/docs`），你可以在网页上直接发请求测试所有接口。这是 FastAPI 最方便的特性之一。

### Q5：为什么数据库会话（Session）每次都要新建和关闭？

数据库连接是有限的资源。如果不关闭：

- 连接数越来越多，最终数据库连不上了
- 数据库文件可能被锁定，导致其他操作失败

用 `get_db()` + `yield` + `finally` 的模式可以保证：无论请求成功还是失败，连接都会被正确关闭。
