import { z } from "zod";

export const Priority = {
	HIGH: "high",
	MEDIUM: "medium",
	LOW: "low",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const todoSchema = z.object({
	title: z.string().min(1, "タイトルは必須です").max(100, "タイトルは100文字以内です"),
	description: z.string().max(500, "説明は500文字以内です"),
	priority: z.enum(["high", "medium", "low"]),
	category: z.string(),
	dueDate: z.string(),
});

export type TodoFormValues = z.infer<typeof todoSchema>;

export interface Todo {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	priority: Priority;
	category: string;
	dueDate: string;
	order: number;
	createdAt: string;
}
