let details = navigator.userAgent;
let length;

let regexp = /android|iphone|kindle|ipad/i;

let isMobileDevice = regexp.test(details);

if (isMobileDevice) {
  length = 5;
} else {
  length = 15;
}

let account = "";

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

// if (isMobileDevice) {
//   walletConnectProviderConfig
//     .enable()
//     .then(function (provider) {
//       checkConnection2(provider);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// } else {
//   if (typeof window.ethereum != undefined) {
//     checkConnection2(window.ethereum);
//   } else {
//     window.open("https://metamask.io/download/");
//   }
// }

if (typeof window.ethereum != undefined) {
    checkConnection2(window.ethereum);
  } 

function checkConnection2(provider) {
  provider
    .request({ method: "eth_accounts" })
    .then(function (accounts) {
      if (accounts.length > 0) {
        account = accounts[0];
        document.getElementById("connect-2").style.display = "none";
        document.getElementById("profile-image").style.display = "block";
        document.getElementById("notification").style.display = "block";
        document.getElementById(
          "profile"
        ).href = `../profile.html?address=${account}`;
        getUser2(account);
      } else {
        document.getElementById("connect-2").style.display = "block";
        document.getElementById("profile-image").style.display = "none";
        document.getElementById("notification").style.display = "none";
      }
    })
    .catch(function (err) {
      console.log(err);
      document.getElementById("connect-2").style.display = "block";
      document.getElementById("profile-image").style.display = "none";
      document.getElementById("notification").style.display = "none";
    });
}


let address = new URLSearchParams(window.location.search).get("address");

let user;



function getUser(account) {
  let getUserXhr = new XMLHttpRequest();
  getUserXhr.open("GET", `/user/${account}`, true);
  getUserXhr.send();

  getUserXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      if (response.avatar != null) {
        document.getElementById("profile-image-2").src =
          "/images/" + response.avatar;
      } else {
        document.getElementById("profile-image-2").src =
          "/images/" + "profile.svg";
      }
    }
  };
}
if (address != null) {
  getUser2();
}

function getUser2() {
  let getUserXhr = new XMLHttpRequest();
  getUserXhr.open("GET", `/user/${address}`, true);
  getUserXhr.send();

  getUserXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      user = JSON.parse(this.response);
      if (user != null) {
        if (user.cover != null) {
          document.getElementById("cover").src = "/images/" + user.cover;
        }
        if (user.name != null) {
          document.getElementById("id").textContent = user.name;
        } else {
          document.getElementById("id").textContent = truncAddress(
            user.walletAddress
          );
        }
        document.getElementById("description").textContent = user.description;
        document.getElementById("followers").textContent = user.followers;
        document.getElementById("following").textContent = user.following;
        document.getElementById("address").textContent = truncAddress(
          user.walletAddress
        );
        if (user.avatar != null) {
          document.getElementById("avatar").src = `../images/${user.avatar}`;
        } 
        loaded();
      }
    }
  };
}

function loaded() {
  document.getElementById("loading-container").style.display = "none";
  document.getElementById("content").style.display = "block";
}

const truncAddress = (address) => {
  let addressTrunc1 = address.slice(0, 5);
  let dot = "...";
  let addressTrunc2 = address.slice(38);
  let addressTrunc1Dot = addressTrunc1.concat(dot);
  return addressTrunc1Dot.concat(addressTrunc2);
};

document.title = `${truncAddress(address)} Owner | Sensis`;

document.body.addEventListener("click", function (e) {
  let targetId = e.target.id;
  if (e.target.classList.contains("item")) {
    changeItems(e.target);
  } else if (targetId == "follow") {
    follow();
  }
});

let hasFollowed;

function follow() {
  if (!hasFollowed) {
    document.getElementById("followers").textContent =
      parseInt(document.getElementById("followers").textContent) + 1;
    hasFollowed = true;
  }
}

document.body.addEventListener("click", function (e) {
  let targetId = e.target.id;
  if (e.target.classList.contains("item")) {
    changeItems(e.target);
  } else if (targetId == "activity") {
    location.reload();
  } else if (targetId == "follow") {
    follow();
  } else if (e.target.id == "toggle-search") {
    openOrClose("nav-bar", "search-bar");
  } else if (e.target.id == "close-search") {
    openOrClose("search-bar", "nav-bar");
  } else if (
    e.target.id == "open-nav-sidebar" ||
    e.target.id == "open-nav-sidebar-2"
  ) {
    document.getElementById("nav-sidebar").style.display = "block";
  } else if (e.target.id == "close-nav-sidebar") {
    document.getElementById("nav-sidebar").style.display = "none";
  }
});

changeItems(document.getElementById("owned"));

function changeItems(selectedItem) {
  let quantity = document.querySelectorAll(".quantity");
  let items = document.querySelectorAll(".item");
  let itemsRoot = document.querySelectorAll(".items-root");
  items.forEach(function (item) {
    item.classList.remove("border-bottom");
    item.classList.replace("w3-text-white", "text-grey-2");
  });
  selectedItem.classList.add("border-bottom");
  selectedItem.classList.add("w3-text-white");

  itemsRoot.forEach(function (item) {
    item.style.display = "none";
  });
  document.getElementById(`${selectedItem.id}-root`).style.display = "block";
  getNft(selectedItem.id, `${selectedItem.id}-root`);

  quantity.forEach(function (item) {
    item.classList.replace("w3-white", "background-grey");
  });
  document
    .getElementById(`${selectedItem.id}-quantity`)
    .classList.replace("background-grey", "w3-white");
}

let nftStatus = ["owned", "on-sale", "created"];

nftStatus.forEach(function (item) {
  getNftQuantity(address, item);
});

function getNftQuantity(address, status) {
  let nftQuantityXhr = new XMLHttpRequest();
  nftQuantityXhr.open(
    "GET",
    `/nft/user/${address}/${status}`,
    true
  );
  nftQuantityXhr.send();

  nftQuantityXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      if (response.length > 0) {
        document.getElementById(`${status}-quantity`).style.display = "inline";
        document.getElementById(`${status}-quantity`).textContent =
          response.length;
      }
    }
  };
}

function getNft(status, id) {
  document.getElementById(
    id
  ).innerHTML = `<div class="w3-center" style="width: 100%"><i class="fa fa-spinner fa-spin biggest" style="margin: 82px 0px 0px"></i></div>`;
  let nftXhr = new XMLHttpRequest();
  nftXhr.open("GET", `/nft/user/${address}/${status}`, true);
  nftXhr.send();

  nftXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      console.log(response);
      if (response.length > 0) {
        let nftAddresses = [];
        response.forEach(function (item) {
          nftAddresses.push(item.token);
        });
        getNftItems(nftAddresses, id);
      } else {
        document.getElementById(
          id
        ).innerHTML = `<p class="biggest no-margin-3">Nothing found</p><p class="text-grey-2 big no-margin-3">We couldn't find anything with this criteria</p>`;
      }
    }
  };
}

const getNftItems = (nftsAddress, id) => {
  let nftsAdressObj = {
    ids: nftsAddress,
  };
  let nftItemsXhr = new XMLHttpRequest();
  nftItemsXhr.open(
    "POST",
    "https://ethereum-api.rarible.org/v0.1/nft/items/byIds",
    true
  );
  nftItemsXhr.setRequestHeader("Content-type", "application/json");
  nftItemsXhr.send(JSON.stringify(nftsAdressObj));

  nftItemsXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      getNftItemMeta(response, id);
    }
  };
};

const getNftItemMeta = (nftItems, id) => {
  let nftItemsMetaArray = [];
  nftItems.forEach(function (item) {
    let nftItemMetaXhr = new XMLHttpRequest();
    nftItemMetaXhr.open(
      "GET",
      `https://ethereum-api.rarible.org/v0.1/nft/items/${item.id}/meta`,
      true
    );
    nftItemMetaXhr.send();

    nftItemMetaXhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.response);
        let nftItemMeta = { ...response };
        nftItemsMetaArray.push({ ...item, nftItemMeta });
        if (nftItemsMetaArray.length == nftItems.length) {
          getNftOrder(nftItemsMetaArray, id);
        }
      }
    };
  });
};

const getNftOrder = (nftItems, id) => {
  let nftItemsOrderArray = [];
  nftItems.forEach(function (item) {
    let nftItemOrderXhr = new XMLHttpRequest();
    nftItemOrderXhr.open(
      "GET",
      `https://ethereum-api.rarible.org/v0.1/order/orders/sell/byItemAndByStatus?contract=${item.contract}&tokenId=${item.tokenId}&status=ACTIVE`,
      true
    );
    nftItemOrderXhr.send();

    nftItemOrderXhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.response);
        let orders = { ...response };
        nftItemsOrderArray.push({ ...item, orders });
        if (nftItemsOrderArray.length == nftItems.length) {
          getNftOrderBids(nftItemsOrderArray, id);
        }
      }
    };
  });
};

const getNftOrderBids = (nftItems, id) => {
  let nftOrderBidsArray = [];
  nftItems.forEach(function (item) {
    let nftOrderBidsXhr = new XMLHttpRequest();
    nftOrderBidsXhr.open(
      "GET",
      `https://ethereum-api.rarible.org/v0.1/order/orders/bids/byItemAndByStatus?contract=${item.contract}&tokenId=${item.tokenId}&status=ACTIVE`,
      true
    );
    nftOrderBidsXhr.send();

    nftOrderBidsXhr.onreadystatechange = function () {
      if (this.status == 200 && this.readyState == 4) {
        let response = JSON.parse(this.response);
        let orderBids = { ...response };
        nftOrderBidsArray.push({ ...item, orderBids });
        if (nftOrderBidsArray.length == nftItems.length) {
          getNftItemCollection(nftOrderBidsArray, id);
        }
      }
    };
  });
};

const getNftItemCollection = (nftItem, id) => {
  let nftItemsMetaAndCollection = [];
  nftItem.forEach(function (item) {
    let nftItemCollectionXhr = new XMLHttpRequest();
    nftItemCollectionXhr.open(
      "GET",
      `https://ethereum-api.rarible.org/v0.1/nft/collections/${item.contract}`,
      true
    );
    nftItemCollectionXhr.send();

    nftItemCollectionXhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.response);
        let collection = { ...response };
        nftItemsMetaAndCollection.push({ collection, ...item });
        if (nftItemsMetaAndCollection.length == nftItem.length) {
          document.getElementById(id).innerHTML = "";
          nftItemsMetaAndCollection.forEach(function (item) {
            document.getElementById(id).innerHTML += bindNft(item);
          });
        }
      }
    };
  });
};

const bindNft = ({ nftItemMeta, collection, id, orderBids, orders }) => {
  let image = "";
  let type = "";
  if (nftItemMeta.content.length > 3) {
    image = nftItemMeta.content[3].url;
    type = nftItemMeta.content[3]["@type"];
    // console.log(nftItemMeta.content[2].url)
  } else if (nftItemMeta.content.length > 2) {
    image = nftItemMeta.content[2].url;
    type = nftItemMeta.content[2]["@type"];
    // console.log(nftItemMeta.content[2].url)
  } else if (nftItemMeta.content.length > 1) {
    image = nftItemMeta.content[1].url;
    type = nftItemMeta.content[1]["@type"];
    // console.log(nftItemMeta.content[1].url)
  } else if (nftItemMeta.content.length == 1) {
    image = nftItemMeta.content[0].url;
    type = nftItemMeta.content[0]["@type"];
    // console.log(content[0].url);
  } else {
    image = "./images/Eli-J.jpeg";
  }

  if (image.startsWith("i")) {
    image = image.replace("ipfs:", "https://ipfs.io/ipfs/");
  }
  //   console.log(name + ": ", image);
  let highestBid = "No bids";
  let highestBidDisplay = "none";
  if (orderBids.orders.length > 0) {
    highestBid = orderBids.orders[0].takePrice.toFixed(2) + " wETH";
    highestBidDisplay = "block";
  }

  let price = "Not for sale";
  let priceDisplay = "none";
  let prompt = "Highest bid";
  if (orders.orders.length > 0) {
    price = orders.orders[orders.orders.length - 1].makePrice + " wETH";
    priceDisplay = "block";
    if (isMobileDevice) {
      prompt = "Price";
      highestBid = price;
    }
  }
  if (type == "IMAGE") {
    return `
        <div
                  class="w3-col s6 l3"
                  style="padding: 6px; flex: 0 0 auto"
                >
                <a href="./nft.html?address=${id}&wallet=${address}">
                  <div
                    class="border-light-brown-2 pointer"
                    style="border-radius: 12px; padding: 8px;"
                  >
                  <div style="position: relative">
                    <img
                    class="nft-height"
                      src="${image}"
                      alt=""
                      style="width: 100%; border-radius: 12px;"
                    />
                    <div style="position: absolute; bottom: 24px; width: 100%; display: flex; justify-content: center;">
                    <div class="w3-white w3-center w3-animate-zoom w3-round-large bold w3-padding small" style="box-shadow: 1px 1px 10px rgb(180, 180, 180); width: 90px; display: none">
                      Buy now
                    </div>
                    </div>
                    </div>
                    <div style="padding: 14px 0px 4px">
                      <div class="w3-row w3-hide-small" style="padding: 0px 8px">
                        <div class="w3-col l10">
                          <p class="no-margin small bold text-grey" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${collection.name}</p>
                        </div>
                        <div class="w3-col l2">
                          <i class="fa fa-ellipsis-h no-margin w3-right"></i>
                        </div>
                      </div>
                      <p class="no-margin bold nft-name" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${nftItemMeta.name}</p>
                      <div class="w3-row w3-round nft-card">
                        <div class="w3-col l9 w3-hide-small nft-text">
                          <p class="no-margin small bold text-grey">Price</p>
                        </div>
    
                        <div class="w3-col l3 nft-text">
                          <p class="no-margin small bold text-grey-2">${prompt}</p>
                        </div>
    
                        <div class="w3-col l9 w3-hide-small nft-text">
                          <p class="no-margin small bold">${price}</p>
                        </div>
                        <div class="w3-col l3">
                          <p class="no-margin small bold">${highestBid}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </a>
                </div>`;
  } else {
    return `
        <div
                  class="w3-col s6 l3"
                  style="padding: 6px; flex: 0 0 auto"
                >
                <a href="./nft.html?address=${id}&wallet=${address}">
                  <div
                    class="border-light-brown-2 pointer"
                    style="border-radius: 12px; padding: 8px;"
                  >
                  <video
                  class="nft-video-height"
                  src="${image}"
                  style="width: 100%; border-radius: 12px"
                  autoplay
                  muted
                  loop
                ></video>
                    <div style="padding: 14px 0px 4px">
                      <div class="w3-row w3-hide-small" style="padding: 0px 8px">
                        <div class="w3-col l10">
                          <p class="no-margin small bold text-grey" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${collection.name}</p>
                        </div>
                        <div class="w3-col l2">
                          <i class="fa fa-ellipsis-h no-margin w3-right"></i>
                        </div>
                      </div>
                      <p class="no-margin bold nft-name" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${nftItemMeta.name}</p>
                      <div class="w3-row w3-round nft-card">
                        <div class="w3-col l8 w3-hide-small nft-text">
                          <p class="no-margin small bold text-grey">Price</p>
                        </div>
    
                        <div class="w3-col l4 nft-text">
                          <p class="no-margin small bold text-grey">${prompt}</p>
                        </div>
    
                        <div class="w3-col l8 w3-hide-small nft-text">
                          <p class="no-margin small bold">Not for sale</p>
                        </div>
                        <div class="w3-col l4">
                          <p class="no-margin small bold">1.8 wETH</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </a>
                </div>`;
  }
};
