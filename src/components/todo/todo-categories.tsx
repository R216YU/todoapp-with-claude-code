"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTodoStore } from "@/stores/todo-store";

interface TodoCategoriesProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TodoCategories({ open, onOpenChange }: TodoCategoriesProps) {
	const { categories, addCategory, deleteCategory } = useTodoStore();
	const [newCategory, setNewCategory] = useState("");

	const handleAdd = () => {
		const trimmed = newCategory.trim();
		if (trimmed && !categories.includes(trimmed)) {
			addCategory(trimmed);
			setNewCategory("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[350px]">
				<DialogHeader>
					<DialogTitle>カテゴリ管理</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="flex gap-2">
						<Input
							placeholder="新しいカテゴリ"
							value={newCategory}
							onChange={(e) => setNewCategory(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<Button size="icon" onClick={handleAdd}>
							<Plus className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-wrap gap-2">
						{categories.map((cat) => (
							<Badge key={cat} variant="secondary" className="gap-1 pr-1 text-sm">
								{cat}
								<button
									type="button"
									onClick={() => deleteCategory(cat)}
									className="ml-1 rounded-full hover:bg-muted p-0.5"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
						{categories.length === 0 && (
							<p className="text-sm text-muted-foreground">カテゴリがありません</p>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
