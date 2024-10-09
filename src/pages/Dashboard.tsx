import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import { Plus, Folder } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore
        .collection('projects')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
          const projectData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Project[];
          setProjects(projectData);
        });

      return () => unsubscribe();
    }
  }, [user]);

  const createNewProject = async () => {
    if (newProjectName.trim() && user) {
      try {
        await firestore.collection('projects').add({
          name: newProjectName,
          userId: user.uid,
          createdAt: new Date(),
        });
        setNewProjectName('');
      } catch (error) {
        console.error('Error creating new project:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <div className="flex">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Enter project name"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createNewProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center mb-4">
              <Folder size={24} className="text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold">{project.name}</h3>
            </div>
            <p className="text-gray-600">
              Created: {project.createdAt.toDate().toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;