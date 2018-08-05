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
        var testPara = $("#testpara");
        var testResult = $("#petresult");
        var testField = $("#fieldName");

        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });

        App.contracts.PaperHelper.deployed().then(function(instance) {
            verificationInstance = instance;
            var paperList = verificationInstance.papers;
            var dataList = verificationInstance.datas;
            for(var i = 0; i < paperList.length; i ++) {
                if(paperList[i].PaperField != testField) {
                    continue;
                }
                var testList = verificationInstance.getDatasByPaper(i);
                for(var j = 0; j < testList.length; j ++) {
                    testPara.append(testList[j].TestParameters);
                    testResult.append(testList[j].TestResults);
                }
            }
        }).catch(function(error) {
            console.warn(error);
        });
        
        return App.bindEvents(dataList);
    },

    bindEvents: function(dataList) {
        $(document).on('click', '.btn-verify', App.handleVerify(dataList));
        $(document).on('click', '.btn-unverify', App.handleUnverify(dataList));
    },

    handleVerify: function (event, dataList) {
        event.preventDefault();
        for(var i = 0; i < dataList.length; i++) {
            if()
        }

    },

    handleUnverify: function (event) {
        event.preventDefault();

    }
    //
    // markAdopted: function(adopters, account) {
    //     var adoptionInstance;
    //
    //     App.contracts.Adoption.deployed().then(function(instance) {
    //         adoptionInstance = instance;
    //
    //         return adoptionInstance.getAdopters.call();
    //     }).then(function(adopters) {
    //         for (i = 0; i < adopters.length; i++) {
    //             if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
    //                 $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    //             }
    //         }
    //     }).catch(function(err) {
    //         console.log(err.message);
    //     });
    // },
    //
    // handleAdopt: function(event) {
    //     event.preventDefault();
    //
    //     var petId = parseInt($(event.target).data('id'));
    //
    //     var adoptionInstance;
    //
    //     web3.eth.getAccounts(function(error, accounts) {
    //         if (error) {
    //             console.log(error);
    //         }
    //
    //         var account = accounts[0];
    //
    //         App.contracts.Adoption.deployed().then(function(instance) {
    //             adoptionInstance = instance;
    //
    //             // Execute adopt as a transaction by sending account
    //             return adoptionInstance.adopt(petId, {from: account});
    //         }).then(function(result) {
    //             return App.markAdopted();
    //         }).catch(function(err) {
    //             console.log(err.message);
    //         });
    //     });
    // }

};

$(function() {
    $(window).load(function() {
        App.init();
    });
});