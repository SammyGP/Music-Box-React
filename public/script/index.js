console.log("Hello scripts are loaded");


// TODO add the data AND acces/refresh token to session storage
// so that i dont need to call the backend api every request


// get the tracks from user playlists function
var getUserTracks = function(userId, listId) {

	// check if list already exists in session storage
	if(sessionStorage.getItem(listId)) {
		console.log(userId);
	} else {
		// if not fetches the data from the server


		// and adds it to the session storage
	}
		// if not fetches the data from the server
		var request = new Request(`http://localhost:3000/playlist/${userId}/${listId}`);
		fetch(request)
		.then(function(response){
			document.querySelector("body").style.opacity = 0.1;
			return response.json();
		})
		.then(function(data){
			//returns various data about the tracks in the playlist
			console.log(data);
			data = data.tracks.items;

			// removes the hidden class so the list is displayed
			document.querySelector(".track-popup").classList.remove("hidden");


			var container = document.getElementById("popup-list");

			// clear the container before appending to make sure new stuff dont get added everytime you click
			// checks if list container has childnodes and deletes them while it has
			if(container.hasChildNodes()){
				while(container.hasChildNodes()) {

					// always selects the first li it encounters
					var rm = container.querySelector("li");
					container.removeChild(rm);
				}
			}

			// populates the list (again if selecting new one)
			data.forEach(function(item){
				var li = document.createElement("li");

				// TODO 
				// currently only displays the first[0] artist, make sure all artist in the artists[] array are displayed

				li.innerHTML = item.track.artists[0].name  + " - " + item.track.name;
				li.dataset.artist = item.track.artists[0].name;
				li.dataset.track = item.track.name;
				li.style.display = "block";

				// hidden input for youtube to send to back end when submiting the song 
				var value = document.createElement("input");
				value.name = "search_query";
				value.value = item.track.artists[0].name + " " + item.track.name;
				value.type = "hidden";
				li.appendChild(value);

				container.appendChild(li);
			})

			// TODO 
			// create the container "popup" window that contains all the trackslist for the user to views what the playlist contains
			var display = document.querySelector(".track-popup").style.display = "block";
			container.style.display = "block";

		}).then(function(){

			// moves the user to the top of the window
			document.querySelector("body").scrollIntoView({behavior: "smooth", block: "start"});
			document.querySelector("body").style.opacity = 1.0;
		})
}

var user = {

	APIurl: "http://localhost:3000",

	// user id might not be need 
	// since the playlist user id is baked into the playlist json => [i].owner.id
	// but might be good to have for saving session data?
	userId: undefined,

	playlists: undefined,

	// returns json of all the authorized users playlists
	getPlaylists: function() {
		fetch(`${this.APIurl}/user/playlist`)
		.then((response) => { return response.json() })
		.then((data) => { 
			this.playlists = [];
			data.items.map((item) => {this.playlists.push(item)}) 
		})
	//.then((response) => {return true})
	},


	// returns json of all the tracks from the selected list playlist
	getPlaylistTracks: function(user, list) {
		fetch((`${this.APIurl}/playlist/${user}/${list}`)
		.then((response) => {return response.json()})
		.then((data) => {return data}))
	}
}


let displayPlaylist = {
	DOM: document.getElementById("js-playlistDisplay"),
	init: function() { this.DOM.appendChild(this.listContainer) },

	listContainer: document.createElement("div"),


	// not too fond of this type of creating element feels clutterd and messy look around for best practice/ designt pattern
	listItemCreator: function(item) {
		let dataContainer = document.createElement("div");

		let name = document.createElement("h2");
		name.innerHTML = item.name;
		dataContainer.appendChild(name);

		let img = document.createElement("img");
		// fallback to the bigger [0] img if [1] not found
		img.src = item.images[1] ? (item.images[1].url) : (item.images[0] ? item.images[0].url : "");
		img.alt = item.name;
		dataContainer.appendChild(img);

		let owner = document.createElement("p");
		owner.innerHTML = item.owner.display_name;
		dataContainer.appendChild(owner);

		return dataContainer;
	},

	addPlaylist: function(arr) {
		arr.map((item) => {
			let li = document.createElement("li");
			console.log("working the magic")
			let data = this.listItemCreator(item);
			li.appendChild(data);
			this.listContainer.appendChild(data);
		});
	}
}

console.log(React);

//window.onload = user.getPlaylists();

let promise = new Promise(function(resolve, reject){
	user.getPlaylists();
	if(user.playlists) {
		console.log("exist");
	} else {
		user.getPlaylists();
		resolve("Getting users");
	}
})
.then(function(data){
	//displayPlaylist.addPlaylist(user.playlist);
})


//displayPlaylist.addPlaylist(user.playlists);

//playlist.getPlaylists();

window.addEventListener("click", function(e){


	// populate the user playlists with the tracks
	if(e.path[1].className === "user-playlist") {
		var userId = e.path[1].dataset.userId;
		var listId = e.path[1].dataset.listId
		getUserTracks(userId, listId);
	}




	// function to remove the popup if clicking anywhere on the screen except the li item in the popup
	var popupContainer = document.querySelector(".track-popup");
	if(popupContainer.classList[1] !== "hidden" && e.target.localName !== "li") {
		popupContainer.classList.add("hidden")
	}





	/*


	// adds the item from the header or user playlist to the submit list
	if(e.path[1].className === "song-box") {
		var listItem = e.path[1]
		listItem.classList.add("list-item");
		listItem.classList.remove("song-box");
		var formData = document.querySelector(".submit-playlist");
		formData.appendChild(listItem);
	}
	if(e.srcElement.className == "submit") {

		// gets the owber id and list name from the playlist form values
		var listOwner = e.srcElement.form[0].value;
		var listId = e.srcElement.form[1].value

		// request the backen /playlist post route with the params needed to get the list tracks from spotify
		// see app.js for more
		var myRequest = new Request(`http://localhost:3000/playlist/${listOwner}/${listId}`);

		var button = e.srcElement.className;
		button.onclick = fetch(myRequest, {
			method: "POST"
		}).then(function(request){
			console.log(request);

			// sets the return type to json
			return request.json();
		}).then(function(myData){
			console.log(myData)
		})
	}

	*/
});



var closeButton = document.getElementById("close-button");
closeButton.onclick = function(){
	document.querySelector(".track-popup").classList.add("hidden")
}


// gets all the users playlists from the server
var getUserPlaylistButton = document.getElementById("get-playlists");
getUserPlaylistButton.addEventListener("click", function(e){

	var request = new Request("http://localhost:3000/user/playlist");
	fetch(request)
	.then(function(response){
		return response.json();
	})
	.then(function(data){
		// returns json of all the users playlists
		data = data.items;
		getUserPlaylistButton.style.display = "none";
		data.forEach(function(item){
			var container = document.querySelector(".user-playlists");
			var div = document.createElement("div");

			div.classList.add("user-playlist");
			var img = document.createElement("img");

			// checks if there is an playlist background image or not
			if(!item.images[0]) {
				img.src = "No image available for playlist";
				// add default image?
				
			} else {
				console.log("image exists");
				img.src = item.images[0].url;
			}
			div.appendChild(img);

			// no show data thats needed for playlist api info
			var userId = item.owner.id;
			var listId = item.id;

			// add the hidden data to the div using the data- attribute
			div.dataset.userId = userId;
			div.dataset.listId = listId;

			// creates the elements containing the display data
			// and appends it to the div
			var displayName = document.createElement("p");
			displayName.innerHTML = item.owner.display_name;
			div.appendChild(displayName);

			var listName = document.createElement("h2");
			listName.innerHTML = item.name;
			div.appendChild(listName);


			// apends the div to the final container
			container.appendChild(div);
		})
	})
})
