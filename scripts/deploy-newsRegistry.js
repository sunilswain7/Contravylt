const hre = require("hardhat");

async function main() {
  const NewsRegistry = await hre.ethers.getContractFactory("NewsRegistry");
  const newsRegistry = await NewsRegistry.deploy();

  await newsRegistry.waitForDeployment();

  console.log("NewsRegistry deployed to:", await newsRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
