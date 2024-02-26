// import {
//   time,
//   loadFixture,
// } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
// import { expect } from "chai";
// import hre from "hardhat";
// import { getAddress, parseEther } from "viem";

// describe("ClipChatPass", function () {
//   async function deployContract() {
//     const [owner, otherAccount] = await hre.viem.getWalletClients();
//     const ownerAddress = owner.account.address;

//     console.log("Deploying ...");
//     const clipChatPass = await hre.viem.deployContract("ClipChatPasses", [
//       ownerAddress,
//       ownerAddress,
//       parseEther("0.05"),
//       parseEther("0.05"),
//       parseEther("0.05"),
//     ]);
//     console.log("Deployed!");

//     const publicClient = await hre.viem.getPublicClient();

//     return {
//       owner,
//       ownerAddress,
//       otherAccount,
//       clipChatPass,
//       publicClient,
//     };
//   }

//   describe("Deployment", function () {
//     it("Should set owner right", async () => {
//       const { clipChatPass, owner, ownerAddress } = await loadFixture(
//         deployContract
//       );
//       //   console.log("owner: ", owner);
//       //   console.log("owner.getAddress(): ", await owner.getAddresses());
//       //   console.log("ownerAddress: ", ownerAddress);
//       //   console.log("otherAccount: ", otherAccount.account.address);
//       expect(await clipChatPass.read.owner()).to.equal(
//         getAddress(owner.account.address)
//       );
//     });
//   });

//   describe("Buy function", () => {
//     it("User should get pass after buying", async () => {
//       const { clipChatPass, ownerAddress } = await loadFixture(deployContract);

//       await clipChatPass.write.getFirstKey();

//       expect(await clipChatPass.read.passesBalance[ownerAddress][ownerAddress]).to.equal(1)
//     });
//   });
// });
