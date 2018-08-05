App = {
  web3Provider: null,
  contracts: {},
  account: null,

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

      return App.render();
    });
  },

  render: function() {
    var PaperHelperInstance;

    web3.eth.getCoinbase(function(err, account) {
	if(err === null) {
	  App.account = account;
	}
    });

    // Load contract data
    App.contracts.PaperHelper.deployed().then(function(instance) {
      $('#myTable').append('<table id="here_table"></table>');
      var table = $('#myTable').children();
      table.append("<tr class='header'><th style='width:6%;'>Thesis</th><th style='width:6%;'>Ranking</th></tr>");
      PaperHelperInstance = instance;
      var papers = PaperHelperInstance.getPapersByOwner(App.account);
      for (var i = 0; i < papers.length; i++) {
        var Thesis = PaperHelperInstance.getPaperMetabyIdx(papers[i])[0];
        var datas = PaperHelperInstance.getDatasByPaper(papers[i]);
        var count = 0;
        for (var j = 0; j < datas.length; j++) {
	  var data = PaperHelperInstance.getDataMetabyIdx(datas[j]);
          count += data[3] - data[4];
        }
        table.append( '<tr><td>' + Thesis + '</td>' + '<td>' + count + '</td></tr>');
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },
};

App.init();

$.getJSON('paper.json', function(data) {
  $('#myTable').append('<table id="here_table"></table>');
  var table = $('#myTable').children();
  table.append("<tr class='header'><th style='width:6%;'>Paper Name</th><th style='width:6%;'>Ranking</th></tr>")
  $('#author').text('Author: ' + data[0].author);
  data = data[0].papers
  for (var i = 0; i < data.length; i++) {
    table.append( '<tr><td>' + data[i].title + '</td>' + '<td>' + data[i].ranking + '</td></tr>');
  }
});

function myFunction() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable").children[0];
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
