const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let ifaceDetails of interfaces[iface]) {
      if (ifaceDetails.family === 'IPv4' && !ifaceDetails.internal) {
        return ifaceDetails.address;
      }
    }
  }
  return null;
}

const localIp = getLocalNetworkIp();
if (localIp) {
  const envFilePath = path.join(__dirname, '.env');

  let envContent = '';
  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, 'utf8');
  }

  const newEnvContent = envContent.replace(/REACT_APP_BACKEND_HOST=.*/g, '') + `\nREACT_APP_BACKEND_HOST=${localIp}`;

  fs.writeFileSync(envFilePath, newEnvContent.trim(), 'utf8');

  console.log(`.env updated: REACT_APP_BACKEND_HOST=${localIp}`);
} else {
  console.error('IP-detecting error');
  process.exit(0);
}
