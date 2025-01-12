import { execSync } from 'child_process';

const checkMcpServices = async () => {
  const services = [
    { name: 'GitHub', command: 'npx @modelcontextprotocol/server-github --status' },
    { name: 'Firebase', command: 'npx @modelcontextprotocol/server-firebase --status' },
    { name: 'Filesystem', command: 'npx @modelcontextprotocol/server-filesystem --status' }
  ];

  console.log('🔍 Checking MCP services...');

  for (const service of services) {
    try {
      console.log(`\nChecking ${service.name} MCP...`);
      execSync(service.command, { stdio: 'inherit' });
      console.log(`✅ ${service.name} MCP is operational`);
    } catch (error) {
      console.error(`❌ ${service.name} MCP check failed:`, error);
      throw error;
    }
  }

  console.log('\n✨ All MCP services are operational!');
};

checkMcpServices();
