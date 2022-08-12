
const defenitions = [
  {name: 'create', alias: 'c', type: String, description: 'Create script or scripterra config. Possible values (script | config)'},
  {name: 'delete', alias: 'd', type: String, description: 'Delete script or schedule. Possible values (script | schedule)'},
  {name: 'name',   alias: 'n', type: String, description: 'Specify script name. Use with --create or --delete.'},
  {name: 'run', alias: 'r', type: String, description: 'Run script. Example: scripterra --run Test --env .test'},
  {name: 'schedule', alias: 's', type: String, description: 'Schedule script. Example: scripterra --schedule Test --env .test --expression \'* * * *\''},
  {name: 'expression', type: String, description: 'Cron expression'},
  {name: 'listall', alias: 'l', type: Boolean, description: 'Show list of all created scripts'},
  {name: 'start-worker', alias: 'w', type: Boolean, description: 'Start scripterra worker'},
  {name: 'deattach', alias: 'D', type: Boolean, description: 'Detach scripterra worker'},
  {name: 'env', alias: 'e', type: String, description: 'Specify environment file name. Example: scripterra --run Test --env .test'},
  {name: 'help', type: Boolean, description: 'Show list of flags'}
];

module.exports = {
  defenitions
};
