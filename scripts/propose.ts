import { ethers, network } from "hardhat";
import {
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  proposalsFile,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
} from "../helper-hardhat-config";

import { moveBlocks } from "../utils/move-blocks";

import * as fs from "fs";

export async function propose(functionToCall: any, args: any) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal Description:\n  ${PROPOSAL_DESCRIPTION}`);

  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    PROPOSAL_DESCRIPTION
  );

  // If working on a development chain, we will push forward till we get to the voting period.
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }
  const proposeReceipt = await proposeTx.wait(1);

  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`Proposed with proposal ID:\n  ${proposalId}`);

  const proposalState = await governor.state(proposalId);
  const proposalSnapShot = await governor.proposalSnapshot(proposalId);
  const proposalDeadline = await governor.proposalDeadline(proposalId);
  // save the proposalId
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));

  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`);
}

propose(FUNC, [NEW_STORE_VALUE])
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
