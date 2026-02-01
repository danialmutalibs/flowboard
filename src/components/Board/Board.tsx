'use client';

import { useEffect, useMemo, useState } from 'react';
import Column from '@/components/Column/Column';
import Modal from '@/components/Modal/Modal';
import TaskForm from '@/components/Task/TaskForm';
import TaskCard from '@/components/Task/TaskCard';
import { Task, Status } from '@/types/task';
import { loadTasks, saveTasks } from '@/lib/storage';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

type SortOption = 'order' | 'createdAt' | 'priority';

const columns: { id: Status; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function Board() {
  /* ---------------- STATE ---------------- */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  /* -------- FILTER + SORT STATE -------- */
  const [priorityFilter, setPriorityFilter] =
    useState<'all' | 'low' | 'medium' | 'high'>('all');

  const [sortBy, setSortBy] = useState<SortOption>('order');

  /* ---------------- HYDRATION ---------------- */
  useEffect(() => {
    setTasks(loadTasks());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveTasks(tasks);
  }, [tasks, hydrated]);

  /* ---------------- DND SETUP ---------------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    })
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.4' } },
    }),
  };

  /* ---------------- CRUD ---------------- */
  const handleSaveTask = (task: Task) => {
    setTasks(prev =>
      prev.some(t => t.id === task.id)
        ? prev.map(t => (t.id === task.id ? task : t))
        : [...prev, task]
    );

    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  /* -------- DERIVED STATE (FILTER + SORT) -------- */
  const tasksByStatus = useMemo(() => {
    const grouped: Record<Status, Task[]> = {
      todo: [],
      'in-progress': [],
      done: [],
    };

    // group
    for (const task of tasks) {
      grouped[task.status].push(task);
    }

    // filter + sort per column
    Object.values(grouped).forEach(list => {
      const filtered =
        priorityFilter === 'all'
          ? list
          : list.filter(task => task.priority === priorityFilter);

      filtered.sort((a, b) => {
        if (sortBy === 'createdAt') {
          return b.createdAt - a.createdAt;
        }

        if (sortBy === 'priority') {
          const rank = { high: 3, medium: 2, low: 1 };
          return rank[b.priority] - rank[a.priority];
        }

        // manual order (DnD)
        return a.order - b.order;
      });

      list.length = 0;
      list.push(...filtered);
    });

    return grouped;
  }, [tasks, priorityFilter, sortBy]);

  /* ---------------- DRAG LOGIC ---------------- */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    document.body.style.overflow = '';
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    setTasks(prev => {
      const activeTask = prev.find(t => t.id === activeId);
      if (!activeTask) return prev;

      const overTask = prev.find(t => t.id === overId);
      const overColumn = columns.find(col => col.id === overId);

      // same column reorder
      if (overTask && overTask.status === activeTask.status) {
        const columnTasks = prev
          .filter(t => t.status === activeTask.status)
          .sort((a, b) => a.order - b.order);

        const reordered = arrayMove(
          columnTasks,
          columnTasks.findIndex(t => t.id === activeId),
          columnTasks.findIndex(t => t.id === overId)
        );

        return prev.map(task => {
          const index = reordered.findIndex(t => t.id === task.id);
          return index !== -1 ? { ...task, order: index } : task;
        });
      }

      // move to another column
      if (overColumn || overTask) {
        const newStatus = overColumn
          ? overColumn.id
          : (overTask!.status as Status);

        const targetTasks = prev
          .filter(t => t.status === newStatus && t.id !== activeId)
          .sort((a, b) => a.order - b.order);

        let insertIndex = targetTasks.length;

        if (overTask && overTask.status === newStatus) {
          insertIndex = targetTasks.findIndex(t => t.id === overId);
        }

        targetTasks.splice(insertIndex, 0, {
          ...activeTask,
          status: newStatus,
        });

        return prev.map(task => {
          const idx = targetTasks.findIndex(t => t.id === task.id);

          if (task.id === activeId) {
            return { ...task, status: newStatus, order: insertIndex };
          }

          if (idx !== -1) {
            return { ...task, order: idx };
          }

          return task;
        });
      }

      return prev;
    });
  };

  if (!hydrated) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-400">
        Loading board…
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */
  return (
    <>
      {/* Filters + Actions */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as any)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortOption)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="order">Manual order</option>
          <option value="createdAt">Newest first</option>
          <option value="priority">Priority</option>
        </select>

        <div className="ml-auto">
          <button
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Add Task
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={e => {
          document.body.style.overflow = 'hidden';
          const task = tasks.find(t => t.id === e.active.id);
          if (task) setActiveTask(task);
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          document.body.style.overflow = '';
          setActiveTask(null);
        }}
      >
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

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="w-72 scale-105 opacity-95">
              <TaskCard
                task={activeTask}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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
