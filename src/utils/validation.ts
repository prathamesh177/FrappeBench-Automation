export const isValidGithubRepo = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Check if it's a GitHub URL
    if (!urlObj.hostname.includes('github.com')) {
      return false;
    }
    
    // Check if it has a valid path structure
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};