import { RepoInfo } from '../types/github';

export const extractRepoInfo = (repoUrl: string): RepoInfo => {
  try {
    const url = new URL(repoUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Basic validation
    if (pathParts.length < 2) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    const owner = pathParts[0];
    const name = pathParts[1];
    
    // Check if a specific branch is specified
    let branch: string | undefined = undefined;
    
    // Check for /tree/branch-name pattern
    if (pathParts.length > 3 && pathParts[2] === 'tree') {
      branch = pathParts[3];
    }
    
    return { owner, name, branch };
  } catch (error) {
    throw new Error('Failed to parse GitHub repository URL');
  }
};