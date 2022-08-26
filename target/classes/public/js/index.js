let address = new URLSearchParams(window.location.search).get("address");

let details = navigator.userAgent;
let length;

let regexp = /android|iphone|kindle|ipad/i;

let isMobileDevice = regexp.test(details);

if (isMobileDevice) {
	length = 5;
} else {
	length = 15;
}

const SPOTLIGHTS = [
	"0x28472a58a490c5e09a238847f66a68a47cc76f0f:1",
	"0xf661d58cfe893993b11d53d11148c4650590c692:9105",
	// "0xd07dc4262bcdbf85190c01c996b4c06a461d2430:323069",
];
const TOPCOLLECTIONS = [
	"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
	"0x39ee2c7b3cb80254225884ca001f57118c8f21b6",
	"0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258",
	"0x26badf693f2b103b021c670c852262b379bbbe8a",
	"0x60e4d786628fea6478f785a6d7e704777c86a7c6",
	"0xccf3baa603dfddd7c41619fdb8dd0306b11571fe",
	"0x23581767a106ae21c074b2276d25e5c3e136a68b",
	"0x2a459947f0ac25ec28c197f09c2d88058a83f3bb",
	"0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
	"0x670d4dd2e6badfbbd372d0d37e06cd2852754a04",
	"0xed5af388653567af2f388e6224dc7c4b3241c544",
	"0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
	"0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e",
	"0xc5b52253f5225835cc81c52cdb3d6a22bc3b0c93",
	"0x892848074ddea461a15f337250da3ce55580ca85",
];

const TRENDINGNFTS = [
	"0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258:7349",
	"0x39ee2c7b3cb80254225884ca001f57118c8f21b6:9982",
	"0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b:19357",
	"0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7:15326",
	"0xba30e5f9bb24caa003e9f2f0497ad287fdf95623:6300",
	"0xd1258db6ac08eb0e625b75b371c023da478e94a9:2013",
	"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d:2288",
	"0x26badf693f2b103b021c670c852262b379bbbe8a:2039",
	"0x31d45de84fde2fb36575085e05754a4932dd5170:9989",
	"0x60e4d786628fea6478f785a6d7e704777c86a7c6:5036",
];

let nftItemsMeta = [];
let nftItemsMetaTrending = [];
let nftItemsMetaCollection = [];
let nftItemsMetaAndCollection = [];

const getNftItems = (nftsAddress) => {
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

	nftItemsXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			getNftItemMeta(response);
		}
	};
};

const getNftItemMeta = (nftItems) => {
	nftItems.forEach(function(item) {
		let nftItemMetaXhr = new XMLHttpRequest();
		nftItemMetaXhr.open(
			"GET",
			`https://ethereum-api.rarible.org/v0.1/nft/items/${item.id}/meta`,
			true
		);
		nftItemMetaXhr.send();

		nftItemMetaXhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.response);
				nftItemsMeta.push({ ...item, ...response });
				if (nftItemsMeta.length == nftItems.length) {
					nftItemsMeta.forEach((item) => {
						document.getElementById("spotlights-root").innerHTML +=
							bindSpotlights(item);
					});
					getNftItemsCollection(TOPCOLLECTIONS2);

				}
			}
		};
	});
};

const getNftItemsCollection = (nftCollections) => {
	nftCollections.forEach(function(item, index) {
		document.getElementById("topcollections-root").innerHTML +=
			bindTopcollections(item, index + 1);
	});
	getNftItems3(TRENDINGNFTS);
};

// const getNftItemsCollection = (nftCollectionsAddress) => {
//   const nftCollectionsAddressObj = {
//     ids: nftCollectionsAddress,
//   };
//   let nftItemCollectionXhr = new XMLHttpRequest();
//   nftItemCollectionXhr.open(
//     "POST",
//     "https://ethereum-api.rarible.org/v0.1/nft/collections/byId",
//     true
//   );
//   nftItemCollectionXhr.setRequestHeader("Content-type", "application/json");
//   nftItemCollectionXhr.send(JSON.stringify(nftCollectionsAddressObj));

//   nftItemCollectionXhr.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       let response = JSON.parse(this.response);
//       getNftCollectionItems(response.collections);
//     }
//   };
// };

// const getNftCollectionItems = (nftCollections) => {
//   let nftCollectionArray = [];
//   nftCollections.forEach((item) => {
//     let nftCollectionItemXhr = new XMLHttpRequest();
//     nftCollectionItemXhr.open(
//       "GET",
//       `https://ethereum-api.rarible.org/v0.1/nft/items/byCollection?collection=${item.id}&size=1`,
//       true
//     );
//     nftCollectionItemXhr.send();

//     nftCollectionItemXhr.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//         let response = JSON.parse(this.response);
//         nftCollectionArray.push({ ...response, ...item });
//         if (nftCollectionArray.length == length) {
//           getNftItemMeta2(nftCollectionArray);
//         }
//       }
//     };
//   });
// };

// const getNftItemMeta2 = (nftItemsCollection) => {
//   console.log(nftItemsCollection);
//   nftItemsCollection.forEach(function (item) {
//     let nftItemMetaXhr = new XMLHttpRequest();
//     nftItemMetaXhr.open(
//       "GET",
//       `https://ethereum-api.rarible.org/v0.1/nft/items/${item.items[0].id}/meta`,
//       true
//     );
//     nftItemMetaXhr.send();

//     nftItemMetaXhr.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//         let response = JSON.parse(this.response);
//         let itemMeta = { ...response };
//         nftItemsMetaCollection.push({ ...item, itemMeta });
//         if (nftItemsMetaCollection.length == length) {
//           nftItemsMetaCollection.forEach((item, index) => {
//             document.getElementById("topcollections-root").innerHTML +=
//               bindTopcollections(item, index + 1);
//           });
//           getNftItems3(TRENDINGNFTS);
//         }
//       }
//     };
//   });
// };

const getNftItems3 = (nftsAddress) => {
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

	nftItemsXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			getNftItemMeta3(response);
		}
	};
};

const getNftItemMeta3 = (nftItems) => {
	nftItems.forEach(function(item) {
		let nftItemMetaXhr = new XMLHttpRequest();
		nftItemMetaXhr.open(
			"GET",
			`https://ethereum-api.rarible.org/v0.1/nft/items/${item.id}/meta`,
			true
		);
		nftItemMetaXhr.send();

		nftItemMetaXhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.response);
				nftItemsMetaTrending.push({ ...item, ...response });
				if (nftItemsMetaTrending.length == nftItems.length) {
					// getNftItemCollection3(nftItemsMetaTrending);
					getNftOrder(nftItemsMetaTrending);
				}
			}
		};
	});
};

const getNftOrder = (nftItems) => {
	let nftItemsOrderArray = [];
	nftItems.forEach(function(item) {
		let nftItemOrderXhr = new XMLHttpRequest();
		nftItemOrderXhr.open(
			"GET",
			`https://ethereum-api.rarible.org/v0.1/order/orders/sell/byItemAndByStatus?contract=${item.contract}&tokenId=${item.tokenId}&status=ACTIVE`,
			true
		);
		nftItemOrderXhr.send();

		nftItemOrderXhr.onreadystatechange = function() {
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
	nftItems.forEach(function(item) {
		let nftOrderBidsXhr = new XMLHttpRequest();
		nftOrderBidsXhr.open(
			"GET",
			`https://ethereum-api.rarible.org/v0.1/order/orders/bids/byItemAndByStatus?contract=${item.contract}&tokenId=${item.tokenId}&status=ACTIVE`,
			true
		);
		nftOrderBidsXhr.send();

		nftOrderBidsXhr.onreadystatechange = function() {
			if (this.status == 200 && this.readyState == 4) {
				let response = JSON.parse(this.response);
				let orderBids = { ...response };
				nftOrderBidsArray.push({ ...item, orderBids });
				if (nftOrderBidsArray.length == nftItems.length) {
					getNftItemCollection3(nftOrderBidsArray);
				}
			}
		};
	});
};

const getNftItemCollection3 = (nftItem) => {
	nftItem.forEach(function(item) {
		let nftItemCollectionXhr = new XMLHttpRequest();
		nftItemCollectionXhr.open(
			"GET",
			`https://ethereum-api.rarible.org/v0.1/nft/collections/${item.contract}`,
			true
		);
		nftItemCollectionXhr.send();

		nftItemCollectionXhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.response);
				let collection = { ...response };
				nftItemsMetaAndCollection.push({ collection, ...item });
				if (nftItemsMetaAndCollection.length == nftItemsMetaTrending.length) {
					nftItemsMetaAndCollection.forEach((item) => {
						document.getElementById("trendingnft-root").innerHTML +=
							bindTrendingNft(item);
					});
					loaded();
					console.log(account)
				}
			}
		};
	});
};

function loaded() {
	document.getElementById("loading-container").style.display = "none";
	document.getElementById("content").style.display = "block";
}

getNftItems(SPOTLIGHTS);

const bindSpotlights = ({ name, content, id, contract }) => {
	let image = "";
	let type = "";
	if (content.length > 3) {
		image = content[3].url;
		type = content[3]["@type"];
		// console.log(content[2].url)
	} else if (content.length > 2) {
		image = content[2].url;
		type = content[2]["@type"];
		// console.log(content[2].url)
	} else if (content.length > 1) {
		image = content[1].url;
		type = content[1]["@type"];
		// console.log(content[1].url)
	} else if (content.length == 1) {
		image = content[0].url;
		type = content[0]["@type"];
		// console.log(content[0].url);
	} else {
		image = "./images/Eli-J.jpeg";
	}

	if (image.startsWith("i")) {
		image = image.replace("ipfs:", "https://ipfs.io/ipfs/");
	}
	//   console.log(name + ": ", image);

	//  let spotlightDataXhr = new XMLHttpRequest();
	//  spotlightDataXhr.open("POST", "/spotlight", true);
	//  spotlightDataXhr.setRequestHeader("Content-type", "application/json");
	//  spotlightDataXhr.send(
	//    JSON.stringify({
	//      name,
	//      animation: image,
	//      address: contract,
	//    })
	//  );
	//
	//  spotlightDataXhr.onreadystatechange = function () {
	//    if (this.readyState == 4 && this.status == 200) {
	//      let response = JSON.parse(this.response);
	//      console.log("SPOTLIGHT", response);
	//    }
	//  };

	if (type == "IMAGE") {
		return `
    <div
              class="w3-col s12 l6"
              style="flex: 0 0 auto; padding-right: 16px;"
            >
            <a href="./collection.html?address=${contract}&wallet=${address}">
              <div class="pointer" style="position: relative">
                <img
                  src="${image}"
                  alt=""
                  style="width: 100%; border-radius: 18px; height: 350px"
                />
                <div style="position: absolute; bottom: 0px; left: 18px; padding: 4px 8px">
                <p
                  class="bold big"
                  style="text-shadow: 1px 1px 5px rgb(50, 50, 50);"
                >
                  ${name}
                </p>
                </div>
              </div>
              </a>
            </div>
    `;
	} else {
		return `
    <div
              class="w3-col s12 l6"
              style="flex: 0 0 auto; padding-right: 16px;"
            >
            <a href="./collection.html?address=${contract}&wallet=${address}">
              <div class="pointer" style="position: relative">
              <video
              src="${image}"
              style="width: 100%; border-radius: 18px;"
              autoplay
              muted
              loop
            ></video>
                <p
                  class="bold big"
                  style="position: absolute; bottom: 0px; left: 18px; text-shadow: 1px 1px 5px rgb(50, 50, 50);"
                >
                  ${name}
                </p>
              </div>
              </a>
            </div>
    `;
	}
};

const bindTopcollections = (
	{ name, usd, total, address, image, floor },
	index
) => {
	return `<div
        class="w3-col s12 l4 w3-padding-16 pointer padding-right-small"
      >
      <a href="./collection.html?address=${address}&wallet=${address}">
        <div class="w3-row">
          <div class="w3-col s1">
            <p class="no-margin bold" style="margin-top: 24px">${index}</p>
          </div>
          <div class="w3-col s2">
            <img
              src="${image}"
              alt=""
              style="height: 65px; width: 65px; border-radius: 65px"
            />
          </div>
          <div class="w3-col s7" style="padding-top: 12px; padding-left: 12px">
            <p class="bold no-margin" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${name}</p>
            <p class="text-grey bold small no-margin">
              Floor: ${floor} ETH
            </p>
          </div>
          <div class="w3-col s2" style="margin-top: 12px">
          <div class="w3-right">
            <p class="no-margin medium bold">${total} ETH</p>
            <p class="medium no-margin w3-text-green bold w3-right">$${usd}</p>
            </div>
          </div>
        </div>
        </a>
      </div>`;
};

const bindTrendingNft = ({
	name,
	content,
	collection,
	id,
	orderBids,
	orders,
}) => {
	let image = "";
	let type = "";
	if (content.length > 3) {
		image = content[3].url;
		type = content[3]["@type"];
		// console.log(content[2].url)
	} else if (content.length > 2) {
		image = content[2].url;
		type = content[2]["@type"];
		// console.log(content[2].url)
	} else if (content.length > 1) {
		image = content[1].url;
		type = content[1]["@type"];
		// console.log(content[1].url)
	} else if (content.length == 1) {
		image = content[0].url;
		type = content[0]["@type"];
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



	//  let trendingNftDataXhr = new XMLHttpRequest();
	//  trendingNftDataXhr.open("POST", "/trendingnft", true);
	//  trendingNftDataXhr.setRequestHeader("Content-type", "application/json");
	//  trendingNftDataXhr.send(
	//    JSON.stringify({
	//      name,
	//      collection: collection.name,
	//      collectionAddress: collection.id,
	//      price,
	//      highestBid,
	//      image,
	//      address: id,
	//    })
	//  );
	//
	//  trendingNftDataXhr.onreadystatechange = function () {
	//    if (this.readyState == 4 && this.status == 200) {
	//      let response = JSON.parse(this.response);
	//      console.log("TRENDING NFTs", response);
	//    }
	//  };

	if (type == "IMAGE") {
		return `
    <div
              class="w3-col s6 l3"
              style="padding-right: 12px; flex: 0 0 auto"
            >
            <a href="./nft.html?address=${id}&wallet=${address}">
              <div
                class="border-light-brown-2 pointer nft"
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
                    <a href="./collection.html?address=${collection.id}">
                      <p class="no-margin small bold text-grey" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${collection.name}</p>
                      </a>
                    </div>
                    <div class="w3-col l2">
                      <i class="fa fa-ellipsis-h no-margin w3-right"></i>
                    </div>
                  </div>
                  <p class="no-margin bold nft-name" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${name}</p>
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
              style="padding-right: 12px; flex: 0 0 auto"
            >
            <a href="./nft.html?address=${id}&wallet=${address}">
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
                  <p class="no-margin bold nft-name">${name}</p>
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

document.body.addEventListener("click", function(e) {
	let targetId = e.target.id;
	if (e.target.id == "toggle-search") {
		openOrClose("nav-bar", "search-bar");
	} else if (e.target.id == "close-search") {
		openOrClose("search-bar", "nav-bar");
	} else if (e.target.id == "open-nav-sidebar") {
		document.getElementById("nav-sidebar").style.display = "block";
	} else if (e.target.id == "close-nav-sidebar") {
		document.getElementById("nav-sidebar").style.display = "none";
	}
});

function openOrClose(close, open) {
	document.getElementById(close).style.display = "none";
	document.getElementById(open).style.display = "block";
}

if (address != null) {
	document.getElementById("connect-2").style.display = "none";
	document.getElementById("profile-image").style.display = "block";
	document.getElementById("notification").style.display = "block";
	document.getElementById("profile").href = `../profile.html?address=${address}`;
	getUser();
}
else {
	document.getElementById("connect-2").style.display = "block";
	document.getElementById("profile-image").style.display = "none";
	document.getElementById("notification").style.display = "none";
}

function getUser() {
	let getUserXhr = new XMLHttpRequest();
	getUserXhr.open("GET", `/user/${address}`, true);
	getUserXhr.send();

	getUserXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			console.log(response.avatar);
			if (response.avatar != null) {
				document.getElementById("profile-image-2").src = "/images/" + response.avatar;
			}
			else {
				document.getElementById("profile-image-2").src = "/images/" + "profile.svg"
			}

		}
	}
}
