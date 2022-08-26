let address = new URLSearchParams(window.location.search).get("address");

let user;

document.getElementById("edit-profile").href = `/editprofile.html?address=${address}`;
document.getElementById("edit-profile-2").href = `/editprofile.html?address=${address}`

getUser()

function getUser() {
	let getUserXhr = new XMLHttpRequest();
	getUserXhr.open("GET", `/user/${address}`, true);
	getUserXhr.send();

	getUserXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			user = JSON.parse(this.response);
			if (user != null) {
				if (user.name != "") {
					document.getElementById("id").textContent = user.name;

				}
				else {
					document.getElementById("id").textContent = truncAddress(user.walletAddress);
				}
				document.getElementById("description").textContent = user.description;
				document.getElementById("followers").textContent = user.followers;
				document.getElementById("following").textContent = user.following;
				document.getElementById("address").textContent = truncAddress(user.walletAddress);
			}

		}
	}
}

const truncAddress = (address) => {
  let addressTrunc1 = address.slice(0, 5);
  let dot = "...";
  let addressTrunc2 = address.slice(38);
  let addressTrunc1Dot = addressTrunc1.concat(dot);
  return addressTrunc1Dot.concat(addressTrunc2);
};
