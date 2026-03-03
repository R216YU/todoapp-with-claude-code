export const PRIORITY_LABELS: Record<string, string> = {
	high: "高",
	medium: "中",
	low: "低",
};

export const PRIORITY_COLORS: Record<string, string> = {
	high: "bg-red-500",
	medium: "bg-yellow-500",
	low: "bg-blue-500",
};

export const DEFAULT_CATEGORIES = ["仕事", "プライベート", "買い物", "勉強"];

export const STATUS_FILTER_OPTIONS = [
	{ value: "all", label: "すべて" },
	{ value: "active", label: "未完了" },
	{ value: "completed", label: "完了" },
] as const;

export type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]["value"];
