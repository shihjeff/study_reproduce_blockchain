var Migrations = artifacts.require("./Migrations.sol");
var FILENAME = artifacts.require("./FILENAME.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(FILENAME);
};
