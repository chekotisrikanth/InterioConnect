import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Calendar } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

export const ActiveProjects: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['activeProjects', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('hired_designers')
        .select(`
          *,
          client:client_id (
            full_name
          ),
          requirement:requirement_id (
            title,
            room_type
          )
        `)
        .eq('designer_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
        <Link
          to="/designer/projects"
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {project.requirement?.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {project.requirement?.room_type} • {project.client?.full_name}
              </p>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                Due {new Date(project.end_date).toLocaleDateString()}
              </div>
            </div>
            <Link
              to={`/designer/projects/${project.id}`}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View Details
            </Link>
          </div>
        ))}

        {projects?.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No active projects
          </p>
        )}
      </div>
    </div>
  );
};