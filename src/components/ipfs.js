//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
const IPFS = require('ipfs-http-client');
// const ipfs = IPFS()
const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http'});

//run with local daemon
// const ipfsApi = require('ipfs-api');
// const ipfs = client('localhost', '5001', {protocol: 'http'});

export default ipfs; 