//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "./ILottery.sol";

contract RandomNumberGenerator is VRFConsumerBase {
    
    bytes32 internal keyHash;    // which chainlink oracle to use
    uint256 internal fee;         // supply contract with link to pay fees = fees to get random number
    address internal requester;
    uint256 public randomResult;   // 
    uint256 public currentLotteryId;

    address public lottery;
    
    modifier onlyLottery() {
        require(
            msg.sender == lottery,
            "Only Lottery can call function"
        );
        _;
    }

    constructor(                      // test                                                         mainnet
        address _vrfCoordinator, // 0xa555fC018435bef5A13C6c6870a9d4C11DEC329C                       0x747973a5A2a4Ae1D3a8fDF5479f1514F65Db9C31        vrfCoordinator
        address _linkToken,  // 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06                           0x404460C6A5EdE2D891e8297795264fDe62ADBB75         link token
        address _lottery,
        bytes32 _keyHash,   // 0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186     0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c       keyHash
        uint256 _fee   // 0.1 * 10 ** 18; Link fee                                                                  0.2 * 10 ** 18;
    ) 
        VRFConsumerBase(
            _vrfCoordinator, 
            _linkToken  
        ) public
    {
        keyHash = _keyHash;
        fee = _fee; 
        lottery = _lottery;
    }
    
    /** 
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber(
        uint256 lotteryId,
        uint256 userProvidedSeed
    ) 
        public 
        onlyLottery()
        returns (bytes32 requestId) 
    {
        require(keyHash != bytes32(0), "Must have valid key hash");
        require(
            LINK.balanceOf(address(this)) >= fee, 
            "Not enough LINK - fill contract with faucet"
        );
        requester = msg.sender;
        currentLotteryId = lotteryId;
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        ILottery(requester).numbersDrawn(
            currentLotteryId,
            requestId,
            randomness
        );
        randomResult = randomness;
    }
}