import { useState, useEffect } from 'react';
import { supabase, PageTemplate } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, Download, Loader } from 'lucide-react';
import PageSelector from '../components/PageSelector';
import SnippetSelector from '../components/SnippetSelector';
import LivePreview from '../components/LivePreview';
import CodeEditor from '../components/CodeEditor';

interface ProjectEditorProps {
  projectId: string;
  onBack: () => void;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  [key: string]: string;
}

const PAGE_FIELDS = {
  home: { html: 'home_custom_html', css: 'home_custom_css', js: 'home_custom_js', template: 'home_template_id' },
  about: {
    html: 'about_custom_html',
    css: 'about_custom_css',
    js: 'about_custom_js',
    template: 'about_template_id',
  },
  services: {
    html: 'services_custom_html',
    css: 'services_custom_css',
    js: 'services_custom_js',
    template: 'services_template_id',
  },
  contact: {
    html: 'contact_custom_html',
    css: 'contact_custom_css',
    js: 'contact_custom_js',
    template: 'contact_template_id',
  },
};

export default function ProjectEditor({ projectId, onBack }: ProjectEditorProps) {
  const { user } = useAuth();
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, [projectId, user]);

  useEffect(() => {
    loadTemplates();
    loadPageContent();
  }, [selectedPage, projectData]);

  async function loadProject() {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Project not found');

      setProjectData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }

  async function loadTemplates() {
    try {
      const { data, error: fetchError } = await supabase
        .from('page_templates')
        .select('*')
        .eq('page_type', selectedPage)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setTemplates(data || []);

      if (projectData && PAGE_FIELDS[selectedPage as keyof typeof PAGE_FIELDS]) {
        const fields = PAGE_FIELDS[selectedPage as keyof typeof PAGE_FIELDS];
        const templateId = projectData[fields.template];
        if (templateId) {
          const selected = data?.find((t) => t.id === templateId);
          setSelectedTemplate(selected || (data && data[0]) || null);
        } else {
          setSelectedTemplate((data && data[0]) || null);
        }
      }
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  }

  function loadPageContent() {
    if (!projectData) return;

    const fields = PAGE_FIELDS[selectedPage as keyof typeof PAGE_FIELDS];
    const customHtml = projectData[fields.html] || '';
    const customCss = projectData[fields.css] || '';
    const customJs = projectData[fields.js] || '';

    if (customHtml || customCss || customJs) {
      setHtml(customHtml);
      setCss(customCss);
      setJs(customJs);
    } else if (selectedTemplate) {
      setHtml(selectedTemplate.html_snippet);
      setCss(selectedTemplate.css_snippet);
      setJs(selectedTemplate.js_snippet);
    }
  }

  function handleTemplateSelect(template: PageTemplate) {
    setSelectedTemplate(template);
    setHtml(template.html_snippet);
    setCss(template.css_snippet);
    setJs(template.js_snippet);
  }

  async function saveProject() {
    if (!projectData) return;

    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const fields = PAGE_FIELDS[selectedPage as keyof typeof PAGE_FIELDS];
      const updateData: Record<string, string> = {
        [fields.html]: html,
        [fields.css]: css,
        [fields.js]: js,
        [fields.template]: selectedTemplate?.id || '',
      };

      const { error: updateError } = await supabase
        .from('user_projects')
        .update(updateData)
        .eq('id', projectId)
        .eq('user_id', user?.id || '');

      if (updateError) throw updateError;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  function exportProject() {
    if (!projectData) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectData.name}</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.name.replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{projectData.name}</h1>
                <p className="text-sm text-gray-600">Editing {selectedPage} page</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saveSuccess && <p className="text-green-600 text-sm font-medium">Saved!</p>}
              <button
                onClick={saveProject}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={exportProject}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          <PageSelector selectedPage={selectedPage} onPageSelect={setSelectedPage} />
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="w-80 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <SnippetSelector
            templates={templates}
            selectedTemplateId={selectedTemplate?.id || null}
            onTemplateSelect={handleTemplateSelect}
            isLoading={false}
          />
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <CodeEditor html={html} css={css} js={js} onUpdate={{ setHtml, setCss, setJs }} />
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <LivePreview html={html} css={css} js={js} />
        </div>
      </div>
    </div>
  );
}
