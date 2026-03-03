"use client";

import { Plus, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TodoCategories } from "@/components/todo/todo-categories";
import { TodoFilters } from "@/components/todo/todo-filters";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoList } from "@/components/todo/todo-list";
import { Button } from "@/components/ui/button";
import type { Todo } from "@/types/todo";

export default function Home() {
	const [mounted, setMounted] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleEdit = (todo: Todo) => {
		setEditingTodo(todo);
		setFormOpen(true);
	};

	const handleFormClose = (open: boolean) => {
		setFormOpen(open);
		if (!open) setEditingTodo(null);
	};

	if (!mounted) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-muted-foreground">読み込み中...</div>
			</div>
		);
	}

	return (
		<div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
			<header className="mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-bold">TODO</h1>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" onClick={() => setCategoriesOpen(true)}>
						<Tag className="h-4 w-4" />
						<span className="sr-only">カテゴリ管理</span>
					</Button>
					<ThemeToggle />
				</div>
			</header>

			<div className="space-y-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<TodoFilters />
					</div>
					<Button onClick={() => setFormOpen(true)} className="shrink-0">
						<Plus className="mr-1 h-4 w-4" />
						追加
					</Button>
				</div>

				<TodoList onEdit={handleEdit} />
			</div>

			<TodoForm open={formOpen} onOpenChange={handleFormClose} editingTodo={editingTodo} />
			<TodoCategories open={categoriesOpen} onOpenChange={setCategoriesOpen} />
		</div>
	);
}
