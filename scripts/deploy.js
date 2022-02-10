const { lottery, lottoNFT, BigNumber, generateLottoNumbers} = require("../test/settings.js");
const { keyHash, vrfCoordinator, linkToken } = process.env;



const main = async () => {

    const [deployer] = await hre.ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    let mock_erc20Contract;
    let boundInstance;

    mock_erc20Contract = await ethers.getContractFactory("Mock_erc20");

    boundInstance = await mock_erc20Contract.deploy(lottery.buy.bound);
    console.log('Bound contract deployed to: ' + boundInstance.address);

    contractFactory = await hre.ethers.getContractFactory('Timer');
    const timerContract = await contractFactory.deploy();
    await timerContract.deployed();
    console.log("Timer Contract deployed to:", timerContract.address);



    let lotteryInstance, lotteryContract;
    lotteryContract = await ethers.getContractFactory("Lottery");
    lotteryInstance = await lotteryContract.deploy(
        boundInstance.address,
        timerContract.address,
        lottery.setup.sizeOfLottery,
        lottery.setup.maxValidRange,
        lottery.setup.bucket.one,
        lottery.setup.bucket.two,
        lottery.setup.bucketDiscount.one,
        lottery.setup.bucketDiscount.two,
        lottery.setup.bucketDiscount.three
    );
    console.log("Lottery Contract deployed to:", lotteryInstance.address);


    let randGenInstance, randGenContract;
    randGenContract = await ethers.getContractFactory("RandomNumberGenerator");
    randGenInstance = await randGenContract.deploy(
        lottery.chainLink.vrfCoordinator,
        lottery.chainLink.linkToken,
        lotteryInstance.address,
        lottery.chainLink.keyHash,
        lottery.chainLink.fee
    );
    console.log("RandomGen Contract deployed to:", randGenInstance.address);


    let lotteryNftInstance, lotteryNftContract;
    lotteryNftContract = await ethers.getContractFactory("LotteryNFT");
    lotteryNftInstance = await lotteryNftContract.deploy(
        lottoNFT.newLottoNft.uri,
        lotteryInstance.address,
        timerContract.address
    );
    console.log("Lottery NFT Contract deployed to:", lotteryNftInstance.address);


    


};
 
  
const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};
  
runMain();





   
