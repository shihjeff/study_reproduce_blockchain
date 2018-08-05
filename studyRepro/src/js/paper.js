App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
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

    // Load contract data
    App.contracts.PaperHelper.deployed().then(function(instance) {
      PaperHelperInstance = instance;
      return PaperHelperInstance.papers;
    }).then(function(papers) {
      console.log(papers);
      $('#myTable').append('<table id="here_table"></table>');
      var table = $('#myTable').children();
      table.append("<tr class='header'><th style='width:6%;'>Thesis</th><th style='width:6%;'>Ranking</th></tr>")
      for (var i = 0; i < papers.length; i++) {
         table.append( '<tr><td>' + papers[i] + '</td>' + '<td>' + 1 + '</td></tr>');
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
