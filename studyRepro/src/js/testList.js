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

        //get field name from url
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

        //field name
        var testField = getUrlParameter('title');

        //get account address
        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });

        petTemplate.find('#pet-para').text("test parameter");
        petTemplate.find(".pet-result").text("result");
        petTemplate.find(".pet-fields").text("fields");
        petsRow.append(petTemplate.html());

        App.contracts.PaperHelper.deployed().then(function(instance) {
            verificationInstance = instance;
            var paperIdxList = verificationInstance.getPaperIdxbyField(testField);
            var dataIdxList = [];
            for(var i = 0; i < paperIdxList.length; i ++) {
                dataIdxList.push(verificationInstance.getDatasByPaper(paperIdxList[i]));
            }

            for(var j = 0; j < dataIdxList.length; j++) {
                var testData = verificationInstance.getDataMetabyIdx(dataIdxList[j]);
                petTemplate.find('#pet-para').text(testData[0]);
                petTemplate.find(".pet-result").text(testData[1]);
                petTemplate.find(".pet-fields").text(testData[2]);
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
