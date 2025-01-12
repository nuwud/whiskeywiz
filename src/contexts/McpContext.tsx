'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeMcpServices, checkMcpServices } from '@/lib/mcp-manager';

interface McpContextType {
  servicesReady: boolean;
  error: Error | null;
  reinitialize: () => Promise<void>;
}

const McpContext = createContext<McpContextType>({
  servicesReady: false,
  error: null,
  reinitialize: async () => {}
});

export function McpProvider({ children }: { children: React.ReactNode }) {
  const [servicesReady, setServicesReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = async () => {
    try {
      await initializeMcpServices();
      await checkMcpServices();
      setServicesReady(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setServicesReady(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <McpContext.Provider 
      value={{
        servicesReady,
        error,
        reinitialize: initialize
      }}
    >
      {children}
    </McpContext.Provider>
  );
}

export const useMcp = () => useContext(McpContext);
