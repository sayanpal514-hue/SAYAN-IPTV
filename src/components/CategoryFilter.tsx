interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

const CategoryFilter = ({ categories, active, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1">
      <button
        onClick={() => onChange("All")}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          active === "All"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === cat
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
