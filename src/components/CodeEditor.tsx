import { useState } from 'react';
import { Code, Eye } from 'lucide-react';

interface CodeEditorProps {
  html: string;
  css: string;
  js: string;
  onUpdate: {
    setHtml: (value: string) => void;
    setCss: (value: string) => void;
    setJs: (value: string) => void;
  };
}

export default function CodeEditor({ html, css, js, onUpdate }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [showEditor, setShowEditor] = useState(true);

  const getContent = () => {
    switch (activeTab) {
      case 'css':
        return css;
      case 'js':
        return js;
      default:
        return html;
    }
  };

  const getUpdater = () => {
    switch (activeTab) {
      case 'css':
        return onUpdate.setCss;
      case 'js':
        return onUpdate.setJs;
      default:
        return onUpdate.setHtml;
    }
  };

  if (!showEditor) {
    return (
      <button
        onClick={() => setShowEditor(true)}
        className="flex items-center justify-center gap-2 h-full text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Code size={24} />
        <span>Show Editor</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex gap-2">
          {(['html', 'css', 'js'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === lang
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowEditor(false)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          title="Minimize editor"
        >
          <Eye size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <textarea
          value={getContent()}
          onChange={(e) => getUpdater()(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm text-gray-800 resize-none focus:outline-none border-0"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
