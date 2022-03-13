window.addEventListener('resize', projectsArrayHandler);
document.addEventListener('scroll', projectsArrayHandler);

function projectsArrayHandler() {
	let column;
	if (window.innerWidth > 1069) {
		column = 3;
	} else if (window.innerWidth > 720) {
		column = 2;
	} else {
		column = 1;
	}
	let yMax = window.scrollY + window.innerHeight;
	let start = 49;
	let unit = 145 + 8;

	let row = Math.floor((yMax - start) / unit) + 1;

	if (column * row > projects.fetched) {
		projects.fetch(column * row - projects.fetched);
	}
}

// function getContents() {
// 	return new Promise((resolve, reject) => {
// 		fetch('https://api.github.com/repos/PropulsiveFox/propulsivefox.github.io/contents/')
// 			.then(response => response.json())
// 			.then(contents => resolve(contents))
// 			.catch(err => reject(err));
// 	});
// }

// function getDirsExclude() {
// 	return new Promise((resolve, reject) => {
// 		fetch('directories_exclude.json')
// 			.then(response => response.json())
// 			.then(dirsExclude => resolve(dirsExclude))
// 			.catch(err => reject(err));
// 	});
// }

// function getProjectsList() {
// 	return Promise.all([getContents(), getDirsExclude()])
// 		.then(a => {
// 			a.forEach(elem => {
// 				if (!(elem instanceof Array)) throw new TypeError(elem + ' is not an Array');
// 			});

// 			let contents = a[0];
// 			let dirsExclude = a[1];

// 			return contents.filter(content => {
// 				if (content.type == 'dir') {
// 					return !dirsExclude.includes(content.name);
// 				} else return false;
// 			});
// 		}).catch(err => {
// 			throw err;
// 		});
// }

// const projects = new Array();
// getProjectsList().then(contents => {
// 	contents.forEach(content => {
// 		projects.push(content);
// 	});
// });

(function () {
	return new Promise((resolve, reject) => {
		fetch('/info.json')
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(err => reject(err));
	});
})().then(contents => {
	contents.forEach(content => {
		projects.list.push(new Project(content));
	})

	projects.list.forEach(project => {
		projects.element.appendChild(project.element);
	});
	projectsArrayHandler();
});
