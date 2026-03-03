"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_LABELS } from "@/lib/constants";
import { useTodoStore } from "@/stores/todo-store";
import { type Todo, type TodoFormValues, todoSchema } from "@/types/todo";

interface TodoFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingTodo?: Todo | null;
}

export function TodoForm({ open, onOpenChange, editingTodo }: TodoFormProps) {
	const { addTodo, updateTodo, categories } = useTodoStore();

	const form = useForm<TodoFormValues>({
		resolver: zodResolver(todoSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: "medium",
			category: "",
			dueDate: "",
		},
	});

	useEffect(() => {
		if (editingTodo) {
			form.reset({
				title: editingTodo.title,
				description: editingTodo.description,
				priority: editingTodo.priority,
				category: editingTodo.category,
				dueDate: editingTodo.dueDate,
			});
		} else {
			form.reset({
				title: "",
				description: "",
				priority: "medium",
				category: "",
				dueDate: "",
			});
		}
	}, [editingTodo, form]);

	const onSubmit = (values: TodoFormValues) => {
		if (editingTodo) {
			updateTodo(editingTodo.id, values);
		} else {
			addTodo(values);
		}
		form.reset({ title: "", description: "", priority: "medium", category: "", dueDate: "" });
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{editingTodo ? "TODOを編集" : "TODOを追加"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">タイトル *</Label>
						<Input id="title" {...form.register("title")} placeholder="タスクのタイトル" />
						{form.formState.errors.title && (
							<p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">説明</Label>
						<Textarea
							id="description"
							{...form.register("description")}
							placeholder="タスクの説明（任意）"
							rows={3}
						/>
						{form.formState.errors.description && (
							<p className="text-sm text-destructive">
								{form.formState.errors.description.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>優先度</Label>
							<Select
								value={form.watch("priority")}
								onValueChange={(value) =>
									form.setValue("priority", value as TodoFormValues["priority"])
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(PRIORITY_LABELS).map(([value, label]) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>カテゴリ</Label>
							<Select
								value={form.watch("category") || "none"}
								onValueChange={(value) => form.setValue("category", value === "none" ? "" : value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="選択..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">なし</SelectItem>
									{categories.map((cat) => (
										<SelectItem key={cat} value={cat}>
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="dueDate">期限日</Label>
						<Input id="dueDate" type="date" {...form.register("dueDate")} />
					</div>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							キャンセル
						</Button>
						<Button type="submit">{editingTodo ? "更新" : "追加"}</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
