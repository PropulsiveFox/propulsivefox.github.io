function getContents() {
	return new Promise((resolve, reject) => {
		fetch('https://api.github.com/repos/PropulsiveFox/propulsivefox.github.io/contents/')
			.then(response => response.json())
			.then(contents => resolve(contents))
			.catch(err => reject(err));
	});
}

function getDirsExclude() {
	return new Promise((resolve, reject) => {
		fetch('directories_exclude.json')
			.then(response => response.json())
			.then(dirsExclude => resolve(dirsExclude))
			.catch(err => reject(err));
	});
}

function getProjects() {
	return Promise.all([getContents(), getDirsExclude()])
		.then(a => {
			a.forEach(elem => {
				if (!(elem instanceof Array)) throw new TypeError(elem + ' is not an Array');
			});

			let contents = a[0];
			let dirsExclude = a[1];

			return contents.filter(content => {
				if (content.type == 'dir') {
					return !dirsExclude.includes(content.name);
				} else return false;
			});
		}).catch(err => {
			throw err;
		});
}
