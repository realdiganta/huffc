const { expect } = require("chai");
const { ethers } = require("hardhat");

let token;
let accounts;
let owner;
let user;
let val;

describe("ERC20", () => {
  beforeEach(async () => {
    val = 1e10;
    accounts = await hre.ethers.getSigners();

    owner = accounts[0].address;
    user = accounts[1].address;

    const Token = await ethers.getContractFactory("ERC20");
    token = await Token.deploy();
    await token.deployed();
  });

  it("Mint & Balance Check", async () => {
    let bal = await token.balanceOf(user);

    await token.mint(user, val);

    bal = await token.balanceOf(user);

    expect(bal).to.equal(val);
  });

  it("total supply TEST", async () => {
    let initSupply = await token.totalSupply();

    expect(initSupply).to.equal(0);

    await token.mint(user, val);

    let newSupply = await token.totalSupply();

    expect(newSupply).to.equal(val);
  });

  it("allowance test", async () => {
    let initAllowance = await token.allowance(owner, user);

    expect(initAllowance).to.equal(0);

    await token.approve(user, val);

    let newAllowance = await token.allowance(owner, user);

    expect(newAllowance).to.equal(val);
  });

  it("transfer from test", async () => {
    await token.mint(owner, val);
    // must fail without approval
    // await expect(token.transferFrom(owner, user, 1)).to.be.reverted;

    await token.approve(user, val);

    let oldAllowance = await token.allowance(owner, user);

    expect(oldAllowance).to.equal(val);

    const toTransfer = val / 50;
    // must succeed with half of val
    await token.transferFrom(owner, user, val);

    // allowance must get reduced
    let newAllowance = await token.allowance(owner, user);
    expect(newAllowance).to.equal(0);

    // let userBal = await token.balanceOf(user);
    // expect(userBal).to.equal(toTransfer);
  });
});
