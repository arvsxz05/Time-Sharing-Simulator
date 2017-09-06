var no_resource = Math.floor(Math.random() * 30) + 1;
var no_user = Math.floor(Math.random() * 30) + 1;
var resources = [];
var users = [];

class Resource {
	constructor () {
		this.status = "Idle";
		this.user = null;
		this.queue = [];
		this.timerCounter = null;
	}

	status (status, user) {
		if(status && status == "Idle") {
			this.status = status;
			this.user = null;
		} else if(status && status == "Used") {
			if(!user || !(user instanceof User))
				throw "User must be defined to declare Used resource.";
			this.status = status;
			this.user = user;
		}
	}

	addUser (user) {
		if(this.status === "Idle") {
			user.status = 'served';
			this.status = "Used";
			this.user = user;
			this.timerCounter = setInterval(function() {
				if(this.user.time == 0) {
					var resource_to_use = resources[Math.floor(Math.random() * no_resource)];
					var time_to_use = Math.floor(Math.random() * 30) + 1;
					this.user.addResource(resource_to_use, time_to_use);

					if(this.queue.length == 0) {
						this.status = "Idle";
						this.user = null;
						this.queue = [];
						clearInterval(this.timerCounter);
					} else {
						clearInterval(this.timerCounter);
						this.status = "Idle";
						this.user = null;
						this.addUser(this.queue.shift());
					}
				} else
					this.user.time--;
			}.bind(this), 1000);
		} else {
			this.queue.push(user);
		}
	}

	get isAvailable () {
		return this.status === "Idle";
	}
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

class User {
	constructor (index) {
		this.resource = null;
		this.time = 0;
		this.status = "Idle";
		this.index = index;
		this.color = getRandomColor();
	}

	addResource(resource, time) {
		if(!resource || !(resource instanceof Resource))
			throw "Resource must be defined.";

		try {
			time = parseInt(time);
			if(time < 1 || time > 30) 
				throw "Time must be only from 1-30.";
		} catch (e) {
			throw "Time must be of type int.";
		}

		this.resource = resource;
		this.time = time;
		this.status = 'waiting';
		resource.addUser(this);
	}
}

function startSystem () {
	for (var i = 0; i < no_resource; i++) {
		resources.push(new Resource());
	}

	for (var i = 0; i < no_user; i++) {
		let user_add = new User(i+1+"");
		var resource_to_use = resources[Math.floor(Math.random() * no_resource)];
		var time_to_use = Math.floor(Math.random() * 30) + 1;
		user_add.addResource(resource_to_use, time_to_use);
		users.push(user_add);
	}
}