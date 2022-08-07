import { ethers } from "hardhat";

async function main() {
  const CtR = await ethers.getContractFactory("CtR");

  const ctr_contract = await CtR.deploy("Cover the Remix!");   
  console.log("Contract deployed to address:", ctr_contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});
