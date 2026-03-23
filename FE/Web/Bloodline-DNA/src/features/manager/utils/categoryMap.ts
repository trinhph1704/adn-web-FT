export const CATEGORY_OPTIONS = [
  { value: 0, label: "Dân sự", api: "civil" },
  { value: 1, label: "Pháp lý", api: "legal" },
];

export function typeToCategory(type: number): string {
  const found = CATEGORY_OPTIONS.find(opt => opt.value === type);
  return found ? found.api : "civil";
}

export function categoryToType(category: string): number {
  const found = CATEGORY_OPTIONS.find(opt => opt.api === category);
  return found ? found.value : 0;
}