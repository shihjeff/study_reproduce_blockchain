App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load data.
        $.getJSON('../data.json', function(data) {
            var dataRow = $('#pprow');
            var dataTemplate = $('#ppTemplate');
            var unique = [];
            for (var i = 0; i < data.length; i ++) {
                if(unique.includes(data[i].fields)) {
                    continue;
                }

                dataTemplate.find('.panel-title').text(data[i].fields);
                dataTemplate.find('.panel-body').html("<button class='button_click' onclick=\"location.href = 'home.html?title=" + data[i].fields + "';\" data-id='0'>Select</button>");
                dataRow.append(dataTemplate.html());
                unique.push(data[i].fields);
            }
        });
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {
        $.getJSON('PaperSet.json', function(paperSet) {
        	// Instantiate a new truffle contract from the artifact
      		App.contracts.PaperSet = TruffleContract(paperSet);
      		// Connect provider to interact with contract
      		App.contracts.PaperSet.setProvider(App.web3Provider);

      		return App.render();
	});
    },

 
   render: function() {
    var paperSetInstance;

    // Load contract data
    App.contracts.PaperSet.deployed().then(function(instance) {
      paperSetInstance = instance;
      return paperSetInstance.papers;
    }).then(function(papers) {
      console.log(papers);
      var dataRow = $('#pprow');
      var dataTemplate = $('#ppTemplate');
      var unique = [];
      for (var i = 0; i < papers.length; i ++) {
	if(unique.includes(papers[i].fields)) {
	    continue;
	}

	dataTemplate.find('.panel-title').text(papers[i].fields);
	dataTemplate.find('.panel-body').html("<button class='button_click' onclick=\"location.href = 'home.html?title=" + papers[i].fields + "';\" data-id='0'>Select</button>");
	dataRow.append(dataTemplate.html());
	unique.push(data[i].fields);
      }

    }).catch(function(error) {
      console.warn(error);
    });
  }, 
 };

$(function() {
    $(window).load(function() {
        App.init();
    });
});
