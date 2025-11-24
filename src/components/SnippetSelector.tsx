import { PageTemplate } from '../lib/supabase';

interface SnippetSelectorProps {
  templates: PageTemplate[];
  selectedTemplateId: string | null;
  onTemplateSelect: (template: PageTemplate) => void;
  isLoading: boolean;
}

export default function SnippetSelector({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  isLoading,
}: SnippetSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 border-r border-gray-200 overflow-y-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex-1 p-4 sm:p-6 border-r border-gray-200">
        <p className="text-gray-500 text-center">No templates available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Templates</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplateId === template.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-2">{template.template_name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded">HTML</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">CSS</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">JS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
