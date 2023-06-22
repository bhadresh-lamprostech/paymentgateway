const { hre } = require("hardhat");

async function main() {
  const PG = await ethers.getContractFactory("PaymentGateway");
  const Pgdep = await PG.deploy();

  await Pgdep.deployed();

  console.log(`deployed to ${Pgdep.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
