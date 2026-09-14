export interface ProjectIntegration {
  id: string;
  name: string;
  latestRelease: string;
  deployStatus: string;
}

export const fetchActiveProjects = async (): Promise<ProjectIntegration[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "1", name: "Landing", latestRelease: "v1.2.0", deployStatus: "READY" },
        { id: "2", name: "E-commerce", latestRelease: "v2.0.1", deployStatus: "BUILDING" },
        { id: "3", name: "Web App", latestRelease: "v0.9.5", deployStatus: "ERROR" },
      ]);
    }, 1000);
  });
};
