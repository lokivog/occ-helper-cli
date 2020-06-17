const path = require('path');

let envType = process.env['check_env_type'];
if (envType === '' || envType === undefined) {
    envType = process.env['NODE_ENV']
}
//console.log(`envType = ${envType}`);
let env = '';
switch (envType) {
    case 'p':
    case 'production':
        env = 'production';
        break;
    case 's':
    case 'stage':
        env = 'stage';
        break;
    default:
        env = 'test';
}

//console.log(`env = ${env}`);
const config = require('nconf')
    .file(env, path.join(__dirname, '..', `default-${env}.json`))
    .file('occ_project.json');

//console.log(`occEnv:host = ${config.get('occEnv:host')}`);

module.exports = config;
