module.exports = {
  apps : [{
    name: 'backend',
    cwd: './backend',
    script: 'npm',
    args: 'start',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  },{
    name: 'frontend',
    cwd: './frontend',
    script: 'npm',
    args: 'start',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
