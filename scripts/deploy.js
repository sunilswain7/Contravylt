const hre = require("hardhat");

async function main() {
  const Contravylt = await hre.ethers.getContractFactory("Contravylt");
  const contravylt = await Contravylt.deploy();

  await contravylt.waitForDeployment();

  console.log("Contravylt deployed to:", await contravylt.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
