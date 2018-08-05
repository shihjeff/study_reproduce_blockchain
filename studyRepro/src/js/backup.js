App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load data.

        $.getJSON('../data.json', function(data) {
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
            var title = getUrlParameter('title');
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');
            $('#secondPage').text(title);
            for (i = 0; i < data.length; i ++) {
                if(data[i].fields != title) {
                    continue;
                }

                petTemplate.find('#pet-para').text(data[i].testParameter);
                petTemplate.find('.pet-result').text(data[i].testResult);
                petTemplate.find('.pet-fields').text(data[i].fields);
                petsRow.append(petTemplate.html());
            }
        });

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
            web3 = new Web3(web3.currentProvider);
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }

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