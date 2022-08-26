let address = new URLSearchParams(window.location.search).get("address");

let user;

getUser();

let username = document.getElementById("username");
let bio = document.getElementById("bio");
let email = document.getElementById("email");
let url = document.getElementById("url");
let twitter = document.getElementById("twitter");
document.body.addEventListener("click", function(e) {
	let targetId = e.target.id;
	if (targetId == "save") {
		console.log("Saved")
		updateUser();
	}
	else if (targetId == "update-avatar") {
		document.getElementById("upload-modal").style.display = "block";
		document.getElementById("avatar").style.display = "block";

	}
	else if (targetId == "update-cover") {
		document.getElementById("upload-modal").style.display = "block";
		document.getElementById("cover").style.display = "block";
	}
	else if (targetId == "cancel-avatar") {
		document.getElementById("upload-modal").style.display = "none";
		document.getElementById("avatar").style.display = "none";
	}
	else if (targetId == "cancel-cover") {
		document.getElementById("upload-modal").style.display = "none";
		document.getElementById("cover").style.display = "none";
	}
});

function fileValidation(event, id, file) {
	console.log("validate")
	var image = document.getElementById(id);
	image.src = URL.createObjectURL(event.target.files[0]);
	const fi = document.getElementById(file);
	if (fi.files.length > 0) {
		for (const i = 0; i <= fi.files.length - 1; i++) {
			const fsize = fi.files.item(i).size;
			const file = Math.round((fsize / 1024));
		}
	}
}

function getUser() {
	let getUserXhr = new XMLHttpRequest();
	getUserXhr.open("GET", `/user/${address}`, true);
	getUserXhr.send();

	getUserXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			user = JSON.parse(this.response);
			if (user != null) {
				username.value = user.name;
				bio.value = user.description;
				email.value = user.email;
				url.value = user.url;
				twitter.value = user.twitter;
			}

		}
	}
}

function updateUser() {
	let userPayload = {
		id: user.id,
		walletAddress: user.walletAddress,
		name: username.value,
		description: bio.value,
		email: email.value,
		url: url.value,
		twitter: twitter.value,
		balance: user.balance,
		usdt: user.usdt,
		hasAccess: user.hasAccess,
		followers: user.followers,
		following: user.following
	}
	let updateUserXhr = new XMLHttpRequest();
	updateUserXhr.open("PUT", "/user", true);
	updateUserXhr.setRequestHeader("Content-type", "application/json");
	console.log(userPayload)
	updateUserXhr.send(JSON.stringify(userPayload));

	updateUserXhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(this.response);
			location.replace(`../profile.html?address=${address}`);
		}
	}
}


