
import React, { useState, useEffect } from 'react';
import type { Project } from './types';
import { generateMockProjects } from './services/mockData';
import ProjectDetailView from './components/ProjectDetailView';
import { ProjectIcon } from './components/icons';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching data from a database or API
    setIsLoading(true);
    setTimeout(() => {
      const mockData = generateMockProjects();
      setProjects(mockData);
      setIsLoading(false);
      // Select the first project by default
      if(mockData.length > 0) {
        setSelectedProjectId(mockData[0].id);
      }
    }, 1000);
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <header className="bg-gray-900/80 border-b border-gray-700 backdrop-blur-sm p-4 flex items-center shadow-lg z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        <h1 className="text-2xl font-bold text-white tracking-wider">Project RFQ Tracker</h1>
      </header>
      
      <main className="flex-grow flex overflow-hidden">
        <aside className="w-1/4 max-w-xs bg-gray-900/60 border-r border-gray-700 flex flex-col p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Projects</h2>
            {isLoading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-gray-700/50 h-12 rounded-md animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <ul className="space-y-2">
                    {projects.map((project) => (
                    <li key={project.id}>
                        <button
                        onClick={() => setSelectedProjectId(project.id)}
                        className={`w-full text-left p-3 rounded-md flex items-center space-x-3 transition-colors ${
                            selectedProjectId === project.id
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'hover:bg-gray-700/50 text-gray-300'
                        }`}
                        >
                        <ProjectIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium truncate">Project {project.projectNumber}</span>
                        </button>
                    </li>
                    ))}
                </ul>
            )}
        </aside>

        <section className="flex-grow bg-gray-800/20 flex flex-col">
          <ProjectDetailView project={selectedProject} />
        </section>
      </main>
    </div>
  );
};

export default App;
