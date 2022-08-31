const provider = new WalletConnectProvider.default({
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

provider
  .enable()
  .then(walletConnect)
  .catch(function (err) {
    console.log(error);
  });

function walletConnect(response) {
  let web3 = new Web3(provider);
}

provider.on("accountsChanged", (accounts) => {
  console.log(accounts);
});

// Subscribe to chainId change
provider.on("chainChanged", (chainId) => {
  console.log(chainId);
});

// Subscribe to session disconnection
provider.on("disconnect", (code, reason) => {
  console.log(code, reason);
});
