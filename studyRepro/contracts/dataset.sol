pragma solidity ^0.4.24;

import "./ownable.sol";

contract DataSet is Ownable {

  event NewData(uint dataId, string testparam, string testresult);

  struct Data {
    string TestParameters;  //inputs
    string TestResults;     //outputs
    string Field;           //field of study
    uint16 verifCount;
    uint16 unverifCount;
  }

  Data[] public datas;

  mapping (uint => address) public dataToOwner;
  mapping (address => uint) public ownerDataCount;

  function _createData(string _testparam, string _testresult, string _field) internal returns (uint) {
    uint id = datas.push(Data(_testparam, _testresult, _field, 0, 0)) - 1;
    dataToOwner[id] = msg.sender;
    ownerDataCount[msg.sender]++;
    emit NewData(id, _testparam, _testresult);
    return id;
  }

}
