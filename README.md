      # FlowBoard 🧩

FlowBoard is a lightweight Kanban-style task management board built with Next.js.  
It supports drag-and-drop task reordering, cross-column movement, and persistent state using localStorage.

This project focuses on clean component architecture, predictable state management, and polished user experience.

📌 What I Learned

Implementing production-grade drag-and-drop interactions

Managing complex UI state without external state libraries

Designing reusable, predictable component APIs

Handling client-side persistence safely in a Next.js environment

---

## ✨ Features

- ✅ Create, edit, and delete tasks
- 🧲 Drag & drop tasks within a column (reorder)
- 🔁 Drag tasks across columns with correct insertion position
- 💾 Persistent state using localStorage
- 🎯 Smooth drag interactions with DragOverlay and sensors
- 🧠 Strong TypeScript typing and domain modeling
- 🖥️ Responsive, clean UI with Tailwind CSS

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **React + TypeScript**
- **Tailwind CSS**
- **@dnd-kit** (drag-and-drop)
- **localStorage** (persistence)

---

## 🧱 Architecture Overview

- `Board`  
  Owns all task state and handles drag-and-drop logic.

- `Column`  
  Acts as a droppable container and renders sortable tasks.

- `TaskCard`  
  Presentational component with a dedicated drag handle.

- `TaskForm + Modal`  
  Shared UI for creating and editing tasks.

State flows **top-down**, with all mutations centralized in the board to keep logic predictable and easy to reason about.

---

## 🧠 Key Design Decisions

- **Order-based sorting**  
  Tasks include an explicit `order` field to support stable reordering.

- **Drag handles instead of full-card dragging**  
  Prevents pointer conflicts with Edit/Delete actions.

- **Guarded localStorage hydration**  
  Prevents SSR issues and U

---

## 🚀 Getting Started

```bash
npm install
npm run dev


