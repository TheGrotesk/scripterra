
const defenitions = [
  {name: 'create', alias: 'c', type: String, description: 'Starts the process of creating a script or trait. Possible values (script | trait | config)'},
  {name: 'name',   alias: 'n', type: String, description: 'Specifies the name of the script or trait when using the --create flag'},
  {name: 'run', alias: 'r', type: String, description: 'Run specified script. (Example: scripterra --run Test)'},
  {name: 'env', alias: 'e', type: String},
  {name: 'help', type: Boolean}
];

module.exports = {
  defenitions
};
