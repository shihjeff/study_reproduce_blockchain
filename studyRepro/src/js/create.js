const IPFS = require("ipfs-api");
const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 === 'undefined') {
      const msg = "Couldn't detect web3. Make sure MetaMask is installed.";
      alert(msg);
      console.error(msg);
      return;
    }
    QuarkChain.injectWeb3(web3, "http://jrpc.testnet.quarkchain.io:38391");
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("PaperHelper.json", function(paperHelper) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.PaperHelper = TruffleContract(paperHelper);
      // Connect provider to interact with contract
      App.contracts.PaperHelper.setProvider(App.web3Provider);

      return App.waitEvent();
    });
  },

  waitEvent: function() {
    $(document).on('click', '.btn-primary', App.createPaper);
  },

  createPaper: function() {
    let field = document.getElementById('field').innerHTML;
    let thesis = document.getElementById('thesis').innerHTML;
    let conclusion = document.getElementById('conclusion').innerHTML;
    let parameters = document.getElementById('parameters').innerHTML;
    let results = document.getElementById('results').innerHTML;
    var PaperHelperInstance;
    App.contracts.PaperHelper.deployed().then(function(instance) {
      PaperHelperInstance = instance;

      return PaperHelperInstance._createPaper(field, thesis, conclusion);
    }).then(function(id) {
      console.log(id);
      return PaperHelperInstance._createDataForPaper(id,parameters,conclusion,field);
    }).then(function(field) {
      ipfs.add(field, (err, hash) => {
        if (err) {
          return console.log(err);
        }
         console.log("HASH: ", hash);
      });
    }).catch((err) => {
      console.error(err);
    });
  }
};
