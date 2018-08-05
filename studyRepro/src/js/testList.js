App = {
    web3Provider: null,
    contracts: {},

    init: function() {
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
        $.getJSON('PaperHelper.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            App.contracts.PaperHelper = TruffleContract(data);

            // Set the provider for our contract
            App.contracts.PaperHelper.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.render();
        });
    },

    render: function() {
        var verificationInstance;
        var petsRow = $('#petsRow');
        var petTemplate = $('#petTemplate');

        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });

        App.contracts.PaperHelper.deployed().then(function(instance) {
            verificationInstance = instance;
            var paperIdxList = verificationInstance.getPaperIdxbyField(testField);
            var dataIdxList = [];
            for(var i = 0; i < paperIdxList.length; i ++) {
                dataIdxList.push(verificationInstance.getDatasByPaper(paperIdxList[i]));
            }

            for(var j = 0; j < dataIdxList.length + 1; j++) {
                var testData = verificationInstance.getDataMetabyIdx(dataIdxList[j]);
                petTemplate.find(".pet-para").text(testData.TestParameters);
                petTemplate.find(".pet-result").text(testData.TestResults);
                petTemplate.find(".pet-fields").text(testData.Field);
                petTemplate.find('.btn-verify').html("<button onclick=\"App.handleVerify('" + dataIdxList[j] + "')\" class=\"btn btn-default btn-verify\" type=\"button\" data-id=\"0\">Verified</button>");
                petTemplate.find('.btn-unverify').html("<button onclick=\"App.handleUnverify('" + dataIdxList[j] + "')\" class=\"btn btn-default btn-unverify\" type=\"button\" data-id=\"0\">Verified</button>");
                petsRow.append(petTemplate.html());
            }
        }).catch(function(error) {
            console.warn(error);
        });
    },

    handleVerify: function (event) {
        var verifyEventInstance;
        // count ++
        App.contracts.PaperHelper.deployed().then(function(instance) {
            verifyEventInstance = instance;
            verifyEventInstance.incVerifCount(event);
        }).catch(function(error) {
            console.warn(error);
        });
    },

    handleUnverify: function (event) {
        var verifyEventInstance;
        // count --
        App.contracts.PaperHelper.deployed().then(function(instance) {
            verifyEventInstance = instance;
            verifyEventInstance.incUnverifCount(event);
        }).catch(function(error) {
            console.warn(error);
        });
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});