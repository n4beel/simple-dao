// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { ethers } from "hardhat";
import { GovernanceToken__factory } from "../typechain";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run("compile");

  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  // We get the contract to deploy
  const signers = await ethers.getSigners();
  const governanceToken = await new GovernanceToken__factory(
    signers[0]
  ).deploy();

  await governanceToken.deployed();

  await governanceToken.delegate(deployer);

  console.log(
    "Governance Token deployed to:",
    governanceToken.address,
    " delegated to:",
    deployer
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
