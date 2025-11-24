interface PageSelectorProps {
  selectedPage: string;
  onPageSelect: (page: string) => void;
}

const pages = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: '👥' },
  { id: 'services', label: 'Services', icon: '⚙️' },
  { id: 'contact', label: 'Contact', icon: '📧' },
];

export default function PageSelector({ selectedPage, onPageSelect }: PageSelectorProps) {
  return (
    <div className="flex gap-2 p-4 bg-white border-b border-gray-200">
      {pages.map((page) => (
        <button
          key={page.id}
          onClick={() => onPageSelect(page.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            selectedPage === page.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{page.icon}</span>
          <span>{page.label}</span>
        </button>
      ))}
    </div>
  );
}
