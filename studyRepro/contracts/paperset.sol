pragma solidity ^0.4.24;

import "./dataset.sol";

contract PaperSet is DataSet {

  event NewPaper(uint dataId, string thesis, string conclusion, string paperfield);

  modifier onlyOwnerOf(uint _dataId) {
    require(msg.sender == dataToOwner[_dataId]);
    _;
  }

  modifier notOwnerOf(uint _dataId) {
    require(msg.sender != dataToOwner[_dataId]);
    _;
  }

  struct Paper {
    string Thesis;
    string Conclusion;
    string PaperField;
  }

  Paper[] public papers;

  // Paper & Owner Relationsip
  mapping (uint => address) public paperToOwner;
  mapping (address => uint) public ownerPaperCount;

  // Paper & Data Relationship
  mapping (uint => uint) public paperDataCount;
  mapping (uint => uint) public DataToPaper;

  function _createPaper(string _thesis, string _conclusion, string _field) internal {
    uint id = papers.push(Paper(_thesis, _conclusion, _field)) - 1;
    paperToOwner[id] = msg.sender;
    ownerPaperCount[msg.sender]++;
    paperDataCount[id] = 0;
    NewPaper(id, _thesis, _conclusion, _field);
  }

  function _createDataForPaper(uint paperId, string _testparam, string _testresult, string _field) internal {
    paperDataCount[paperId]++;
    uint id = _createData(_testparam, _testresult, _field);
    DataToPaper[id] = paperId;
  }

}
