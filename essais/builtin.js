/*
console.log("hello world");
console.warn("warning qui va bien");
console.error('error message a without stack trace');
console.error(new Error('error message b with stack trace')); 
console.log("suite");
*/

console.log("PATH=" + process.env.PATH) ; //AFFICHE variable d'environnement PATH
//process.exit(0);
//console.log("pas de suite et message pas affiché si process arreté") ;

console.log("process.title=" + process.title); //ex: "... node  builtin.js"
console.log("id of this process=" + process.pid); //ex: 19544
console.log("id of parent process=" + process.ppid); //ex: 320
console.log(`Current working directory: ${process.cwd()}`);
console.log("Memory usage:" + JSON.stringify(process.memoryUsage()));

const os = require('node:os');
console.log(`os name is ${os.type()}`); //ex: Windows_NT or Linux or ...
console.log(`os platform is ${os.platform()}`); //ex: Win32 or ...
console.log(`user home directory is ${os.homedir()}`); //C:\Users\username or /home/username
console.log(`hostname is ${os.hostname()}`);
console.log(`map of ip address= ${JSON.stringify(os.networkInterfaces())}`);
console.log(`nb cpus = ${os.cpus().length}`);//ex: 8
console.log(`free memory=${os.freemem()} , total=${os.totalmem()}`);//ex: 8491798528 , total=16497295360
