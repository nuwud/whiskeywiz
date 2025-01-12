// MCP Service Manager

interface McpService {
  name: string;
  command: string;
  status: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

export const mcpServices: McpService[] = [
  {
    name: 'GitHub',
    command: '@modelcontextprotocol/server-github',
    status: async () => {
      try {
        await execCommand('npx @modelcontextprotocol/server-github --status');
        return true;
      } catch (error) {
        console.error('GitHub MCP Error:', error);
        return false;
      }
    },
    initialize: async () => {
      // GitHub MCP initialization
    }
  },
  {
    name: 'Firebase',
    command: '@modelcontextprotocol/server-firebase',
    status: async () => {
      try {
        await execCommand('npx @modelcontextprotocol/server-firebase --status');
        return true;
      } catch (error) {
        console.error('Firebase MCP Error:', error);
        return false;
      }
    },
    initialize: async () => {
      // Firebase MCP initialization
    }
  },
  {
    name: 'Filesystem',
    command: '@modelcontextprotocol/server-filesystem',
    status: async () => {
      try {
        await execCommand('npx @modelcontextprotocol/server-filesystem --status');
        return true;
      } catch (error) {
        console.error('Filesystem MCP Error:', error);
        return false;
      }
    },
    initialize: async () => {
      // Filesystem MCP initialization
    }
  },
  {
    name: 'Puppeteer',
    command: '@modelcontextprotocol/server-puppeteer',
    status: async () => {
      try {
        await execCommand('npx @modelcontextprotocol/server-puppeteer --status');
        return true;
      } catch (error) {
        console.error('Puppeteer MCP Error:', error);
        return false;
      }
    },
    initialize: async () => {
      // Puppeteer MCP initialization
    }
  }
];

const execCommand = async (command: string): Promise<void> => {
  const { execSync } = require('child_process');
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    throw error;
  }
};

export const initializeMcpServices = async () => {
  console.log('🚀 Initializing MCP services...');
  
  for (const service of mcpServices) {
    try {
      console.log(`Initializing ${service.name} MCP...`);
      await service.initialize();
      console.log(`✅ ${service.name} MCP initialized`);
    } catch (error) {
      console.error(`❌ ${service.name} MCP initialization failed:`, error);
      throw error;
    }
  }

  console.log('✨ All MCP services initialized!');
};

export const checkMcpServices = async () => {
  console.log('🔍 Checking MCP services...');
  
  const results = await Promise.all(
    mcpServices.map(async (service) => {
      const status = await service.status();
      return { service: service.name, status };
    })
  );

  const failedServices = results.filter(r => !r.status);
  
  if (failedServices.length > 0) {
    throw new Error(
      `Following MCP services failed: ${failedServices.map(f => f.service).join(', ')}`
    );
  }

  console.log('✨ All MCP services are operational!');
  return true;
};
