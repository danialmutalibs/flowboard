'use client';

import { useMemo, useState } from 'react';
import Column from '@/components/Column/Column';
import Modal from '@/components/Modal/Modal';
import TaskForm from '@/components/Task/TaskForm';
import TaskCard from '@/components/Task/TaskCard';
import { Task, Status } from '@/types/task';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

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
      order: 0,
      createdAt: Date.now(),
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // ---------------- DND SETUP ----------------
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // smooth drag
      },
    })
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

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

  // ---------------- DERIVED STATE ----------------
  const tasksByStatus = useMemo(() => {
    const grouped: Record<Status, Task[]> = {
      todo: [],
      'in-progress': [],
      done: [],
    };

    for (const task of tasks) {
      grouped[task.status].push(task);
    }

    // sort by order
    Object.values(grouped).forEach(list =>
      list.sort((a, b) => a.order - b.order)
    );

    return grouped;
  }, [tasks]);

  // ---------------- DRAG LOGIC ----------------
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    setTasks(prev => {
      const activeTask = prev.find(t => t.id === activeId);
      if (!activeTask) return prev;

      // -------- SAME COLUMN REORDER --------
      const sameColumnTask = prev.find(
        t => t.id === overId && t.status === activeTask.status
      );

      if (sameColumnTask) {
        const columnTasks = prev
          .filter(t => t.status === activeTask.status)
          .sort((a, b) => a.order - b.order);

        const oldIndex = columnTasks.findIndex(t => t.id === activeId);
        const newIndex = columnTasks.findIndex(t => t.id === overId);

        const reordered = arrayMove(columnTasks, oldIndex, newIndex);

        return prev.map(task => {
          const index = reordered.findIndex(t => t.id === task.id);
          return index !== -1
            ? { ...task, order: index }
            : task;
        });
      }

      // -------- MOVE TO ANOTHER COLUMN --------
      if (columns.some(col => col.id === overId)) {
        return prev.map(task =>
          task.id === activeId
            ? {
                ...task,
                status: overId as Status,
                order: Date.now(),
              }
            : task
        );
      }

      return prev;
    });
  };

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={event => {
          const task = tasks.find(t => t.id === event.active.id);
          if (task) setActiveTask(task);
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        {/* Board */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map(col => (
            <Column
              key={col.id}
              title={col.title}
              status={col.id}
              tasks={tasksByStatus[col.id]}
              onDelete={handleDeleteTask}
              onEdit={task => {
                setEditingTask(task);
                setModalOpen(true);
              }}
            />
          ))}
        </section>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="w-64">
              <TaskCard
                task={activeTask}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
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
