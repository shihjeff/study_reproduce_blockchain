pragma solidity ^0.4.24;

import "./paperset.sol";

contract PaperHelper is PaperSet {

  uint weiFee = 5000000; // test

  function setWeiFee(uint _fee) external onlyOwner {
    weiFee = _fee;
  }

  function incVerifCount(uint _dataId) external notOwnerOfData(_dataId) {
    datas[_dataId].verifCount++;
    msg.sender.transfer(weiFee);
  }

  function incUnverifCount(uint _dataId) external notOwnerOfData(_dataId) {
    datas[_dataId].unverifCount++;
    msg.sender.transfer(weiFee);
  }

  function getDatasByOwner(address _owner) external view returns(uint[]) {
    uint[] memory result = new uint[](ownerDataCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < datas.length; i++) {
      if (dataToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getPapersByOwner(address _owner) external view returns(uint[]) {
    uint[] memory result = new uint[](ownerPaperCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < papers.length; i++) {
      if (paperToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getDatasByPaper(uint paperId) external view onlyOwnerOfPaper(paperId) returns(uint[]) {
    uint[] memory result = new uint[](paperDataCount[paperId]);
    uint counter = 0;
    for (uint i = 0; i < datas.length; i++) {
      if (DataToPaper[i] == paperId) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getPaperMetabyIdx(uint paperId) external view returns(string,string,string) {
    return (papers[paperId].Thesis, papers[paperId].Conclusion, papers[paperId].PaperField);
  }

  function getDataMetabyIdx(uint dataId) external view returns(string,string,string, uint16, uint16) {
    return (datas[dataId].TestParameters, datas[dataId].TestResults,
      datas[dataId].Field, datas[dataId].verifCount, datas[dataId].unverifCount);
  }

  function getPaperIdxbyField(string field) external view returns(uint[]) {
    uint counter = 0;
    uint i = 0;
    for (i = 0; i < papers.length; i++) {
      if (keccak256(papers[i].PaperField) == keccak256(field)) {
        counter++;
      }
    }

    uint[] memory result = new uint[](counter);
    counter = 0;
    for (i = 0; i < papers.length; i++) {
      if (keccak256(papers[i].PaperField) == keccak256(field)) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

}
