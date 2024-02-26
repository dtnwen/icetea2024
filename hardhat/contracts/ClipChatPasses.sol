// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ClipChatPasses is Ownable, ReentrancyGuard {
    address public protocolFeeDestination;
    uint256 public protocolFeePercent;
    uint256 public subjectEntryFeePercent;
    uint256 public subjectExitFeePercent;

    // PassesSubject => (Holder => Balance)
    // How many passes each holder holds
    mapping(address => mapping(address => uint256)) public passesBalance;

    // Holder => (PassesSubject => Balance) NEW
    // How many passes you hold
    mapping(address => mapping(address => uint256)) public passesOwned;
    // Holder => TotalPasses NEW
    mapping(address => uint256) public totalPassesHold;

    // PassesSubject => Supply
    // supply of a pass
    mapping(address => uint256) public passesSupply;
    // holders of a pass
    // mapping(address => uint256) public holders;

    event Trade(
        address trader,
        address subject,
        bool isBuy,
        uint256 passesAmount,
        uint256 ethAmount,
        uint256 protocolEthAmount,
        uint256 subjectEthAmount,
        uint256 supply
    );

    constructor(
        address initialOwner,
        address _protocolFeeDestination,
        uint256 _protocolFeePercent,
        uint256 _subjectEntryFeePercent,
        uint256 _subjectExitFeePercent
    ) Ownable(initialOwner) {
        require(
            (_protocolFeePercent + _subjectEntryFeePercent) < 1 ether &&
                (_protocolFeePercent + _subjectExitFeePercent) < 1 ether,
            "Invalid total fee percent"
        );

        protocolFeeDestination = _protocolFeeDestination;
        protocolFeePercent = _protocolFeePercent;
        subjectEntryFeePercent = _subjectEntryFeePercent;
        subjectExitFeePercent = _subjectExitFeePercent;
    }

    function setFeeDestination(address _feeDestination) public onlyOwner {
        require(_feeDestination != address(0), "Invalid fee destination");
        protocolFeeDestination = _feeDestination;
    }

    function setProtocolFeePercent(uint256 _feePercent) public onlyOwner {
        require(
            (_feePercent + subjectEntryFeePercent) < 1 ether &&
                (_feePercent + subjectExitFeePercent) < 1 ether,
            "Invalid total fee percent"
        );

        protocolFeePercent = _feePercent;
    }

    function setSubjectEntryFeePercent(uint256 _feePercent) public onlyOwner {
        require(
            (protocolFeePercent + _feePercent) < 1 ether,
            "Invalid total fee percent"
        );
        subjectEntryFeePercent = _feePercent;
    }

    function setSubjectExitFeePercent(uint256 _feePercent) public onlyOwner {
        require(
            (protocolFeePercent + _feePercent) < 1 ether,
            "Invalid total fee percent"
        );
        subjectExitFeePercent = _feePercent;
    }

    function getPrice(
        uint256 supply,
        uint256 amount
    ) public pure returns (uint256) {
        uint256 sum1 = ((supply - 1) * (supply) * (2 * (supply - 1) + 1)) / 6;
        uint256 sum2 = ((supply - 1 + amount) *
            (supply + amount) *
            (2 * (supply - 1 + amount) + 1)) / 6;
        uint256 summation = sum2 - sum1;
        return (summation * 1 ether) / 16000;
    }

    function getBuyPrice(
        address passesSubject,
        uint256 amount
    ) public view returns (uint256) {
        return
            getPrice(
                passesSupply[passesSubject] == 0
                    ? 1
                    : passesSupply[passesSubject],
                amount
            );
    }

    function getSellPrice(
        address passesSubject,
        uint256 amount
    ) public view returns (uint256) {
        return getPrice(passesSupply[passesSubject] - amount, amount);
    }

    function getBuyPriceAfterFee(
        address passesSubject,
        uint256 amount
    ) public view returns (uint256) {
        uint256 price = getBuyPrice(passesSubject, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 subjectFee = (price * subjectEntryFeePercent) / 1 ether;
        return price + protocolFee + subjectFee;
    }

    function getSellPriceAfterFee(
        address passesSubject,
        uint256 amount
    ) public view returns (uint256) {
        uint256 price = getSellPrice(passesSubject, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 subjectFee = (price * subjectExitFeePercent) / 1 ether;
        return price - protocolFee - subjectFee;
    }

    function getFirstKey() public {
        require(
            passesSupply[msg.sender] == 0,
            "User has already initialized first key!"
        );

        passesBalance[msg.sender][msg.sender] += 1;
        passesOwned[msg.sender][msg.sender] += 1;
        totalPassesHold[msg.sender] += 1;
        passesSupply[msg.sender] += 1;
        }

    function buyPasses(
        address passesSubject,
        uint256 amount
    ) public payable nonReentrant {
        uint256 supply = passesSupply[passesSubject];
        if (supply == 0) {
            passesBalance[passesSubject][passesSubject] += 1;
            passesSupply[passesSubject] += 1;
            emit Trade(passesSubject, passesSubject, true, 1, 0, 0, 0, 1);
        }

        // uint256 userSupply = passesSupply[msg.sender];
        // if (userSupply == 0) {
        //     passesBalance[passesSubject][msg.sender] += 1;
        //     passesSupply[msg.sender] += 1;
        //     emit Trade(msg.sender, passesSubject, true, 1, 0, 0, 0, 1);
        // }
        uint256 price = getPrice(passesSupply[passesSubject], amount);
        uint256 protocolFee = ((price * protocolFeePercent) / 1 ether);
        uint256 subjectFee = (price * subjectEntryFeePercent) / 1 ether;
        require(
            msg.value >= price + protocolFee + subjectFee,
            "Insufficient payment"
        );

        passesBalance[passesSubject][msg.sender] += amount;
        passesSupply[passesSubject] += amount;
        passesOwned[msg.sender][passesSubject] += amount;
        totalPassesHold[msg.sender] += amount;

        emit Trade(
            msg.sender,
            passesSubject,
            true,
            amount,
            price,
            protocolFee,
            subjectFee,
            supply + amount
        );

        (bool success1, ) = protocolFeeDestination.call{value: protocolFee}("");
        (bool success2, ) = passesSubject.call{value: subjectFee}("");
        require(success1 && success2, "Unable to send funds");
    }

    function sellPasses(
        address passesSubject,
        uint256 amount
    ) public payable nonReentrant {
        uint256 supply = passesSupply[passesSubject];
        require(supply > amount, "Cannot sell the last pass");
        uint256 price = getPrice(supply - amount, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 subjectFee = (price * subjectExitFeePercent) / 1 ether;
        require(
            passesBalance[passesSubject][msg.sender] >= amount,
            "Insufficient passes"
        );
        passesBalance[passesSubject][msg.sender] -= amount;

        passesSupply[passesSubject] -= amount;
        passesOwned[msg.sender][passesSubject] -= amount;
        totalPassesHold[msg.sender] -= amount;
        emit Trade(
            msg.sender,
            passesSubject,
            false,
            amount,
            price,
            protocolFee,
            subjectFee,
            supply - amount
        );
        (bool success1, ) = msg.sender.call{
            value: price - protocolFee - subjectFee
        }("");
        (bool success2, ) = protocolFeeDestination.call{value: protocolFee}("");
        (bool success3, ) = passesSubject.call{value: subjectFee}("");
        require(success1 && success2 && success3, "Unable to send funds");
    }
}
