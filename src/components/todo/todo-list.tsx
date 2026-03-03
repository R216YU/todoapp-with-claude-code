"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo } from "react";
import { useTodoStore } from "@/stores/todo-store";
import type { Todo } from "@/types/todo";
import { TodoItem } from "./todo-item";

interface TodoListProps {
	onEdit: (todo: Todo) => void;
}

export function TodoList({ onEdit }: TodoListProps) {
	const { todos, searchQuery, statusFilter, priorityFilter, categoryFilter, reorderTodos } =
		useTodoStore();

	const filteredTodos = useMemo(() => {
		return todos
			.filter((todo) => {
				if (searchQuery) {
					const query = searchQuery.toLowerCase();
					if (
						!todo.title.toLowerCase().includes(query) &&
						!todo.description.toLowerCase().includes(query)
					) {
						return false;
					}
				}
				if (statusFilter === "active" && todo.completed) return false;
				if (statusFilter === "completed" && !todo.completed) return false;
				if (priorityFilter !== "all" && todo.priority !== priorityFilter) return false;
				if (categoryFilter !== "all" && todo.category !== categoryFilter) return false;
				return true;
			})
			.sort((a, b) => a.order - b.order);
	}, [todos, searchQuery, statusFilter, priorityFilter, categoryFilter]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = todos.findIndex((t) => t.id === active.id);
		const newIndex = todos.findIndex((t) => t.id === over.id);

		const reordered = arrayMove(todos, oldIndex, newIndex).map((todo, index) => ({
			...todo,
			order: index,
		}));

		reorderTodos(reordered);
	};

	if (filteredTodos.length === 0) {
		return (
			<div className="py-12 text-center text-muted-foreground">
				{todos.length === 0
					? "TODOがありません。新しいタスクを追加しましょう！"
					: "条件に一致するTODOがありません。"}
			</div>
		);
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext
				items={filteredTodos.map((t) => t.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="space-y-2">
					{filteredTodos.map((todo) => (
						<TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
