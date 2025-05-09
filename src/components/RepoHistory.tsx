import React from 'react';
import { Clock, ExternalLink, Github } from 'lucide-react';

interface RepoHistoryProps {
  repositories: string[];
  onSelect: (repoUrl: string) => void;
}

export const RepoHistory: React.FC<RepoHistoryProps> = ({ repositories, onSelect }) => {
  const extractRepoName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
    } catch (error) {
      console.error('Invalid URL:', error);
    }
    return url;
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <Clock size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Recent Repositories</h3>
      </div>
      
      <div className="space-y-2">
        {repositories.map((repo, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group transition-colors"
            onClick={() => onSelect(repo)}
          >
            <div className="flex items-center">
              <Github size={14} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {extractRepoName(repo)}
              </span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={repo} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 hover:text-blue-600 p-1"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};