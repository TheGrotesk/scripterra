
const defenitions = [
  {name: 'create', alias: 'c', type: String, description: 'Starts the process of creating a script or trait. Possible values (script | trait | config)'},
  {name: 'name',   alias: 'n', type: String, description: 'Specifies the name of the script or trait when using the --create flag'},
  {name: 'run', alias: 'r', type: String, description: 'Run specified script. (Example: scripterra --run Test)'},
  {name: 'schedule', alias: 's', type: String, description: 'Schedule script. (Example: scripterra --schedule Test --env .test --expression \'* * * *\''},
  {name: 'expression', type: String, description: 'Cron expression'},
  {name: 'listall', alias: 'l', type: Boolean, description: 'Show list of all created scripts'},
  {name: 'start-worker', alias: 'w', type: Boolean, description: 'Start worker that process schedules script'},
  {name: 'env', alias: 'e', type: String},
  {name: 'help', type: Boolean}
];

module.exports = {
  defenitions
};
