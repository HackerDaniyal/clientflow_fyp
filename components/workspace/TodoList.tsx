"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createTodo, reorderTodos, toggleTodoDone } from "@/app/actions/todos";

type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  sort_order: number | null;
};

function SortableItem({
  todo,
  workspaceId,
  onToggle,
}: {
  todo: Todo;
  workspaceId: string;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: todo.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-btn border border-neutral-200 bg-white px-3 py-2"
    >
      <button
        type="button"
        className="cursor-grab text-neutral-400"
        {...attributes}
        {...listeners}
        aria-label="Drag"
      >
        ⋮⋮
      </button>
      <input
        type="checkbox"
        checked={todo.is_done}
        onChange={() => void toggleTodoDone(todo.id, workspaceId, !todo.is_done).then(onToggle)}
      />
      <span className={`flex-1 text-sm ${todo.is_done ? "text-neutral-400 line-through" : ""}`}>
        {todo.title}
      </span>
    </div>
  );
}

export function TodoList({ workspaceId, initial }: { workspaceId: string; initial: Todo[] }) {
  const router = useRouter();
  const sorted = useMemo(
    () => [...initial].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [initial]
  );
  const [items, setItems] = useState(sorted);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setItems(sorted);
  }, [sorted]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    await reorderTodos(
      workspaceId,
      next.map((t) => t.id)
    );
  }

  const [title, setTitle] = useState("");

  return (
    <div className="space-y-4">
      <Card className="space-y-2 p-4">
        <Label>New task</Label>
        <div className="flex gap-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Button
            type="button"
            onClick={async () => {
              if (!title.trim()) return;
              await createTodo(workspaceId, { title });
              setTitle("");
              startTransition(() => router.refresh());
            }}
          >
            Add
          </Button>
        </div>
      </Card>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => void onDragEnd(e)}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((todo) => (
              <SortableItem
                key={todo.id}
                todo={todo}
                workspaceId={workspaceId}
                onToggle={() => startTransition(() => router.refresh())}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
