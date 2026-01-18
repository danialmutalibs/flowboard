'use client';

import { useMemo, useState } from 'react';
import Column from '@/components/Column/Column';
import Modal from '@/components/Modal/Modal';
import TaskForm from '@/components/Task/TaskForm';
import { Task, Status } from '@/types/task';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { DragOverlay } from '@dnd-kit/core';
import TaskCard from '@/components/Task/TaskCard';



const columns: { id: Status; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function Board() {
  // ---------------- STATE ----------------
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design Kanban UI',
      status: 'todo',
      priority: 'high',
      createdAt: Date.now(),
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ---------------- CRUD ----------------
  const handleSaveTask = (task: Task) => {
    setTasks(prev => {
      const exists = prev.some(t => t.id === task.id);
      return exists
        ? prev.map(t => (t.id === task.id ? task : t))
        : [...prev, task];
    });

    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over) return;

  const activeId = active.id as string;

  setTasks(prev => {
    const activeTask = prev.find(t => t.id === activeId);
    if (!activeTask) return prev;

    const overId = over.id as Status;

    // If dropped on a column, update status
    if (columns.some(col => col.id === overId)) {
      return prev.map(task =>
        task.id === activeId
          ? { ...task, status: overId }
          : task
      );
    }

    return prev;
  });
};

const [activeTask, setActiveTask] = useState<Task | null>(null);



  // ---------------- DERIVED STATE ----------------
  const tasksByStatus = useMemo(() => {
    const grouped: Record<Status, Task[]> = {
      todo: [],
      'in-progress': [],
      done: [],
    };

    for (const task of tasks) {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    }

    return grouped;
  }, [tasks]);

  // ---------------- RENDER ----------------
  return (
    <>
      {/* Add Task Button */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {/* Board */}
      <DndContext onDragStart={(event) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  }}
  onDragEnd={(event) => {
    handleDragEnd(event);
    setActiveTask(null);
  }}
  onDragCancel={() => setActiveTask(null)}>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map(col => (
          <Column
            key={col.id}
            title={col.title}
            status={col.id}
            tasks={tasksByStatus[col.id]}
            onDelete={handleDeleteTask}
            onEdit={task => {
              if (!task) return; // extra safety
              setEditingTask(task);
              setModalOpen(true);
            }}
          />
        ))}
      </section>
      </DndContext>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
      >
        <TaskForm
          initialTask={editingTask ?? undefined}
          onSubmit={handleSaveTask}
        />
      </Modal>
    </>
  );
}
