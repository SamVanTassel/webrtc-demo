import { browser } from '$app/environment';

type UserType = {
	name: string;
	id: string;
};

class User {
	value = $state({
		name: '',
		id: ''
	});
	constructor() {
		if (browser) {
			const savedUser = sessionStorage.getItem('user');
			if (savedUser) this.set(JSON.parse(savedUser));
		}
	}

	get() {
		return this.value;
	}

	setName(name: string) {
		this.value.name = name;
		sessionStorage.setItem('user', JSON.stringify(this.value));
	}
	setId(id: string) {
		this.value.id = id;
	}

	set(user: UserType) {
		this.value = user;
		sessionStorage.setItem('user', JSON.stringify(this.value));
	}
}

export const user = new User();
