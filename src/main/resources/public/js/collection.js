let details = navigator.userAgent;
let length;

let regexp = /android|iphone|kindle|ipad/i;

let isMobileDevice = regexp.test(details);

if (isMobileDevice) {
  length = 5;
} else {
  length = 15;
}

let continuationKey;
const getNftCollectionItems = (
  nftCollection,
  isAddressListed,
  continuation
) => {
  let nftCollectionItemXhr = new XMLHttpRequest();
  nftCollectionItemXhr.open(
    "GET",
    `https://ethereum-api.rarible.org/v0.1/nft/items/byCollection?collection=${nftCollection}&size=20&continuation=${continuation}`,
    true
  );
  nftCollectionItemXhr.send();

  nftCollectionItemXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      getNftItemMeta(response.items, isAddressListed);
      continuationKey = response.continuation;
    }
  };
};

const getNftItemMeta = (nftItems, isAddressListed) => {
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
          getNftOrder(nftItemsMetaArray);
          if (!isAddressListed) {
            document.getElementById("image").innerHTML = placeImage(
              nftItemsMetaArray[nftItemsMetaArray.length - 1].nftItemMeta
            );
          }
        }
      }
    };
  });
};

const getNftOrder = (nftItems) => {
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
          getNftOrderBids(nftItemsOrderArray);
        }
      }
    };
  });
};

const getNftOrderBids = (nftItems) => {
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
          getNftItemCollection(nftOrderBidsArray);
        }
      }
    };
  });
};

const getNftItemCollection = (nftItem) => {
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
          nftItemsMetaAndCollection.forEach(function (item) {
            document.getElementById("nft-root").innerHTML += bindNft(item);
          });
          document.getElementById("load-more").innerHTML = "Load More";
          loaded();
        }
      }
    };
  });
};

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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
  let price = "Not for sale";
  let priceDisplay = "none";
  prompt = "Highest bid";

  if (orders.orders.length > 0) {
    price = orders.orders[orders.orders.length - 1].makePrice + " wETH";
    priceDisplay = "block";
    if (isMobileDevice) {
      console.log("Yeah");
      prompt = "Price";
    }
  }

  let highestBid = "No bids";
  let highestBidDisplay = "none";
  if (orderBids.orders.length > 0) {
    highestBid = orderBids.orders[0].takePrice.toFixed(2) + " wETH";
    highestBidDisplay = "block";
  }
  if (type == "IMAGE") {
    return `
        <div
                  class="w3-col s6 l3"
                  style="padding: 6px; flex: 0 0 auto"
                >
                <a href="./nft.html?address=${id}">
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
                          <p class="no-margin small bold text-grey">${collection.name}</p>
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
                <a href="./nft.html?address=${id}">
                  <div
                    class="border-light-brown-2 pointer"
                    style="border-radius: 12px; padding: 8px;"
                  >
                  <video
                  src="${image}"
                  style="width: 100%; border-radius: 12px; height: 160px"
                  autoplay
                  muted
                  loop
                ></video>
                    <div style="padding: 14px 0px 4px">
                      <div class="w3-row w3-hide-small" style="padding: 0px 8px">
                        <div class="w3-col l10">
                          <p class="no-margin small bold text-grey">${collection.name}</p>
                        </div>
                        <div class="w3-col l2">
                          <i class="fa fa-ellipsis-h no-margin w3-right"></i>
                        </div>
                      </div>
                      <p class="no-margin bold nft-name">${nftItemMeta.name}</p>
                      <div class="w3-row w3-round nft-card">
                        <div class="w3-col l8 w3-hide-small nft-text">
                          <p class="no-margin small bold text-grey">Price</p>
                        </div>
    
                        <div class="w3-col l4 nft-text">
                          <p class="no-margin small bold text-grey">Highest bid</p>
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
function placeImage(nftItemMeta) {
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
    // console.log(nftItemMeta.content[0].url);
  } else {
    image = "./images/Eli-J.jpeg";
  }

  if (image.startsWith("i")) {
    image = image.replace("ipfs:", "https://ipfs.io/ipfs/");
  }
  //   console.log(name + ": ", image);

  if (type == "IMAGE") {
    return `
      <img
              src="${image}"
              alt=""
              style="width: 100px; height: 100px; border-radius: 100px"
            />
      `;
  } else {
    return `
      <video
                src="${image}"
                style="width: 100px; height: 100px; border-radius: 100px"
                autoplay
                muted
                loop
              ></video>`;
  }
}

function placeImage2(image) {
  return `<img
    src="${image}"
    alt=""
    style="width: 100px; height: 100px; border-radius: 50px"
  />
`;
}

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

let totalItems = 0;

const getNftCollectionItems2 = (nftCollection, continuation) => {
  let nftCollectionItemXhr = new XMLHttpRequest();
  nftCollectionItemXhr.open(
    "GET",
    `https://ethereum-api.rarible.org/v0.1/nft/items/byCollection?collection=${nftCollection}&size=1000&continuation=${continuation}`,
    true
  );
  nftCollectionItemXhr.send();

  nftCollectionItemXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      totalItems += response.total;
      if (response.continuation) {
        getNftCollectionItems2(address, response.continuation);
      } else {
        document.getElementById("items").textContent = kFormatter(totalItems);
      }
    }
  };
};

let floorArray = [];
let volume = 0.0;
let owners = 0;
const getNftCollectionSellOrders = (nftCollection, continuation) => {
  let nftCollectionSellOrdersXhr = new XMLHttpRequest();
  nftCollectionSellOrdersXhr.open(
    "GET",
    `https://ethereum-api.rarible.org/v0.1/order/orders/sell/byCollectionAndByStatus?collection=${nftCollection}&size=1000&continuation=${continuation}`,
    true
  );
  nftCollectionSellOrdersXhr.send();

  nftCollectionSellOrdersXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      response.orders.forEach(function (item) {
        floorArray.push(item.makePrice);
        volume += item.makePrice / 2;
        if (item.maker) {
          owners += 1;
        }
      });

      if (response.continuation) {
        getNftCollectionSellOrders(address, response.continuation);
      } else {
        // document.getElementById("volume").textContent = kFormatter(volume.toFixed()) + " ETH";
        document.getElementById("floor").textContent =
          kFormatter(floorArray[0].toFixed()) + " ETH";
        document.getElementById("owners").textContent = kFormatter(owners * 3);
        // console.log("Volume", volume.toFixed(2));
        // console.log("Floor array", Math.min(...floorArray));
        // console.log("owners", owners * 3)
        // console.log(floorArray)
      }
    }
  };
};

const getNftCollection = (nftCollection, isAddressListed) => {
  let nftCollectionXhr = new XMLHttpRequest();
  nftCollectionXhr.open(
    "GET",
    `https://ethereum-api.rarible.org/v0.1/nft/collections/${nftCollection}`,
    true
  );
  nftCollectionXhr.send();

  nftCollectionXhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = JSON.parse(this.response);
      document.getElementById("owner").textContent = truncAddress(
        response.owner
      );
      if (!isAddressListed) {
        document.getElementById("name").textContent = response.name;
        document.getElementById("description").textContent = response.symbol;
      }
    }
  };
};

let hasAddress = new URLSearchParams(window.location.search).has("address");
let address = "";
if (hasAddress) {
  address = new URLSearchParams(window.location.search).get("address");
  document.getElementById("address").textContent = truncAddress(address);

  let isAddressListed = TOPCOLLECTIONS2.some(
    (collection) => collection["address"] === address
  );
  if (!isAddressListed) {
    getNftCollection(address, false);
    getNftCollectionItems(address, false, "");
    getNftCollectionItems2(address, "");
    getNftCollectionSellOrders(address, "");
  } else {
    let addressListed = TOPCOLLECTIONS2.find(
      (collection) => collection["address"] == address
    );
    document.getElementById("name").textContent = addressListed.name;
    document.getElementById("description").textContent =
      addressListed.description;
    document.getElementById("image").innerHTML = placeImage2(
      addressListed.image
    );
    document.getElementById("cover-image").src = addressListed.coverImage;
    document.getElementById("floor").textContent = addressListed.floor + " ETH";
    document.getElementById("volume").textContent =
      addressListed.volume + " ETH";
    document.getElementById("items").textContent = addressListed.items;
    document.getElementById("owners").textContent = addressListed.owners;
    getNftCollection(address, true);
    getNftCollectionItems(address, true, "");
  }
}

document.body.addEventListener("click", function (e) {
  let targetId = e.target.id;

  if (targetId == "load-more") {
    document.getElementById(
      "load-more"
    ).innerHTML = `<span class="fa fa-spinner bigger fa-spin"></span>`;
    getNftCollectionItems(address, true, continuationKey);
  }
  else if(targetId == "activity") {
    location.reload();
  }
});
