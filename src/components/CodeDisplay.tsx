import { useState } from 'react';
import { Code, Eye } from 'lucide-react';

interface CodeDisplayProps {
  html: string;
  css: string;
  js: string;
}

export default function CodeDisplay({ html, css, js }: CodeDisplayProps) {
  const [showCode, setShowCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

  const codeContent = {
    html,
    css,
    js,
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showCode ? <Eye size={16} /> : <Code size={16} />}
            {showCode ? 'Hide Code' : 'View Code'}
          </button>
        </div>
      </div>

      {showCode && (
        <div className="h-64">
          <div className="flex border-b border-gray-200">
            {(['html', 'css', 'js'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === lang
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="h-full overflow-auto bg-gray-50 p-4">
            <pre className="text-sm text-gray-800">
              <code>{codeContent[activeTab]}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
