"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/constants";
import { useTodoStore } from "@/stores/todo-store";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
	todo: Todo;
	onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
	const { toggleTodo, deleteTodo } = useTodoStore();

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: todo.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const isOverdue =
		todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString());

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={`p-3 ${isDragging ? "opacity-50 shadow-lg" : ""} ${
				todo.completed ? "opacity-60" : ""
			}`}
		>
			<div className="flex items-start gap-3">
				<button
					type="button"
					className="mt-1 cursor-grab touch-none text-muted-foreground hover:text-foreground"
					{...attributes}
					{...listeners}
				>
					<GripVertical className="h-4 w-4" />
				</button>

				<Checkbox
					checked={todo.completed}
					onCheckedChange={() => toggleTodo(todo.id)}
					className="mt-1"
				/>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span
							className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
						>
							{todo.title}
						</span>
						<Badge
							variant="secondary"
							className={`${PRIORITY_COLORS[todo.priority]} text-white text-xs`}
						>
							{PRIORITY_LABELS[todo.priority]}
						</Badge>
						{todo.category && (
							<Badge variant="outline" className="text-xs">
								{todo.category}
							</Badge>
						)}
					</div>

					{todo.description && (
						<p className="mt-1 text-sm text-muted-foreground">{todo.description}</p>
					)}

					{todo.dueDate && (
						<div
							className={`mt-1 flex items-center gap-1 text-xs ${
								isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
							}`}
						>
							<Calendar className="h-3 w-3" />
							<span>{todo.dueDate}</span>
							{isOverdue && <span>（期限切れ）</span>}
						</div>
					)}
				</div>

				<div className="flex gap-1">
					<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(todo)}>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-destructive hover:text-destructive"
						onClick={() => deleteTodo(todo.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</Card>
	);
}
