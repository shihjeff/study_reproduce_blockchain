pragma solidity ^0.4.24;

import "./paperset.sol";

contract PaperHelper is PaperSet {

  function incVerifCount(uint _dataId) external notOwnerOf(_dataId) {
    datas[_dataId].verifCount++;
  }

  function incUnverifCount(uint _dataId) external notOwnerOf(_dataId) {
    datas[_dataId].unverifCount++;
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


}
