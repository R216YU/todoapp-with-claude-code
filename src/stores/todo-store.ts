import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CATEGORIES, type StatusFilter } from "@/lib/constants";
import type { Todo } from "@/types/todo";

interface TodoState {
	todos: Todo[];
	categories: string[];
	searchQuery: string;
	statusFilter: StatusFilter;
	priorityFilter: string;
	categoryFilter: string;

	// Actions
	addTodo: (todo: Omit<Todo, "id" | "order" | "createdAt" | "completed">) => void;
	updateTodo: (id: string, updates: Partial<Todo>) => void;
	deleteTodo: (id: string) => void;
	toggleTodo: (id: string) => void;
	reorderTodos: (todos: Todo[]) => void;

	// Category actions
	addCategory: (category: string) => void;
	deleteCategory: (category: string) => void;

	// Filter actions
	setSearchQuery: (query: string) => void;
	setStatusFilter: (filter: StatusFilter) => void;
	setPriorityFilter: (filter: string) => void;
	setCategoryFilter: (filter: string) => void;
}

export const useTodoStore = create<TodoState>()(
	persist(
		(set) => ({
			todos: [],
			categories: DEFAULT_CATEGORIES,
			searchQuery: "",
			statusFilter: "all",
			priorityFilter: "all",
			categoryFilter: "all",

			addTodo: (todo) =>
				set((state) => ({
					todos: [
						...state.todos,
						{
							...todo,
							id: crypto.randomUUID(),
							completed: false,
							order: state.todos.length,
							createdAt: new Date().toISOString(),
						},
					],
				})),

			updateTodo: (id, updates) =>
				set((state) => ({
					todos: state.todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)),
				})),

			deleteTodo: (id) =>
				set((state) => ({
					todos: state.todos.filter((todo) => todo.id !== id),
				})),

			toggleTodo: (id) =>
				set((state) => ({
					todos: state.todos.map((todo) =>
						todo.id === id ? { ...todo, completed: !todo.completed } : todo,
					),
				})),

			reorderTodos: (todos) => set({ todos }),

			addCategory: (category) =>
				set((state) => ({
					categories: state.categories.includes(category)
						? state.categories
						: [...state.categories, category],
				})),

			deleteCategory: (category) =>
				set((state) => ({
					categories: state.categories.filter((c) => c !== category),
					todos: state.todos.map((todo) =>
						todo.category === category ? { ...todo, category: "" } : todo,
					),
				})),

			setSearchQuery: (searchQuery) => set({ searchQuery }),
			setStatusFilter: (statusFilter) => set({ statusFilter }),
			setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
			setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
		}),
		{
			name: "todo-storage",
			partialize: (state) => ({
				todos: state.todos,
				categories: state.categories,
			}),
		},
	),
);
