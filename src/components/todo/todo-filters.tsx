"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PRIORITY_LABELS, STATUS_FILTER_OPTIONS } from "@/lib/constants";
import { useTodoStore } from "@/stores/todo-store";

export function TodoFilters() {
	const {
		searchQuery,
		statusFilter,
		priorityFilter,
		categoryFilter,
		categories,
		setSearchQuery,
		setStatusFilter,
		setPriorityFilter,
		setCategoryFilter,
	} = useTodoStore();

	return (
		<div className="space-y-3">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="検索..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-9"
				/>
			</div>

			<div className="flex flex-wrap gap-2">
				<Select
					value={statusFilter}
					onValueChange={(value) =>
						setStatusFilter(value as (typeof STATUS_FILTER_OPTIONS)[number]["value"])
					}
				>
					<SelectTrigger className="w-[130px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{STATUS_FILTER_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={priorityFilter} onValueChange={setPriorityFilter}>
					<SelectTrigger className="w-[130px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">優先度: すべて</SelectItem>
						{Object.entries(PRIORITY_LABELS).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								優先度: {label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={categoryFilter} onValueChange={setCategoryFilter}>
					<SelectTrigger className="w-[150px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">カテゴリ: すべて</SelectItem>
						{categories.map((cat) => (
							<SelectItem key={cat} value={cat}>
								{cat}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
