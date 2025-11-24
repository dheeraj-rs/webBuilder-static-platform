import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Edit3, Loader } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface DashboardProps {
  onProjectSelect: (projectId: string) => void;
  onCreateClick: () => void;
}

export default function Dashboard({ onProjectSelect, onCreateClick }: DashboardProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, [user]);

  async function loadProjects() {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_projects')
        .select('id, name, description, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('user_projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Projects</h1>
          <p className="text-gray-600">Create and manage your website projects</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={onCreateClick}
          className="mb-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Project
        </button>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-600 mb-4">No projects yet. Create your first one to get started!</p>
            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              <Plus size={20} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description || 'No description'}</p>

                  <div className="text-xs text-gray-500 mb-4">
                    Last updated: {new Date(project.updated_at).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onProjectSelect(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
