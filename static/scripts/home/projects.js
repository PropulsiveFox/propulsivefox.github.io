class Project {
	constructor(href) {
		this.element = document.createElement('div');
		this.element.className = 'project';
		let a = document.createElement('a');
		this.element.appendChild(a);
		a.href = href;

		let img = document.createElement('img');
		img.className = 'skeleton';
		img.width = img.height = 127;
		img.src = '/static/icons/blank.png';

		let name = document.createElement('div');
		name.className = 'skeleton skeleton-title project-name';

		let filters = document.createElement('div');
		filters.className = 'filters-icons';
		let filter = document.createElement('div');
		filter.className = 'skeleton skeleton-filter';
		filters.appendChild(filter);
		filters.appendChild(filter.cloneNode());

		let time = document.createElement('time');
		time.className = 'skeleton skeleton-time published';

		a.appendChild(img);
		a.appendChild(name);
		a.appendChild(filters);
		a.appendChild(time);

		this.href = href;
		this.fetched = false;
	}

	fetch(doc) {
		return new Promise((resolve, reject) => {
			if (this.fetched) return resolve();

			let a = this.element.firstElementChild;
			fetch(a.href + '/info.json')
				.then(response => response.json())
				.then(json => {
					let img = a.querySelector('img');
					img.removeAttribute('class');
					img.src = json.image;

					let name = a.querySelector('.project-name');
					name.className = 'project-name';
					name.innerHTML = json.name;

					let filters = a.querySelector('.filters-icons');
					while (filters.firstChild) filters.removeChild(filters.firstChild);
					this.filters = json.filterResponses;
					json.filterResponses.forEach(filter => {
						let filterElement = document.createElement('div');
						let filterSplit = filter.split('-');
						let filterIndex;
						if (filterSplit[0] === 'size') {
							if (filterSplit[1] === 'small') filterIndex = 0;
							if (filterSplit[1] === 'medium') filterIndex = 1;
							if (filterSplit[1] === 'large') filterIndex = 2;
						} else if (filterSplit[0] === 'type') {
							if (filterSplit[1] === 'tool') filterIndex = 3;
							if (filterSplit[1] === 'demo') filterIndex = 4;
							if (filterSplit[1] === 'game') filterIndex = 5;
						} else {
							throw new TypeError(`${a.href}/info.json filterResponse is not Valid`);
						}
						filterElement.className = `filters-icon sprt${filterIndex} sprt2x`
						filters.appendChild(filterElement);
					});

					let time = a.querySelector('time');
					time.className = 'published';
					let dateTime = new Date(json.published);
					time.setAttribute('datetime', dateTime.toUTCString());
					time.innerHTML = dateTime.toLocaleDateString();

					this.fetched = true;
					resolve();
				}).catch(err => {
					reject(err);
				});
		});
	}

	show() {
		this.element.style.display = null;
	}
	hide() {
		this.element.style.display = 'none';
	}

	filterCheck() {
		if (!this.fetched) return false;

		return this.filters.every(filterName =>
			filters.some(filter => filterName === filter.filterName && filter.applied)
		);
	}
}

class Projects {
	constructor() {
		this.element = document.querySelector('#projects-grid');
		this.list = new Array();
		this.fetched = 0;
	}

	get length() {
		return this.list.length;
	}

	fetch(n = 1) {
		if (this.length - this.fetched >= n);
		else n = this.length - this.fetched;

		if (n <= 0) return;
		else {
			let target = this.list.at(this.fetched);
			target.fetch().then(() => {
				if (target.filterCheck()) {
					this.fetch(n - 1);
				} else {
					this.fetch(n);
				}
			}).catch(err => {
				throw err;
			}).finally(() => {
				this.fetched++;
				this.update();
			});
		}
	}
	update() {
		this.list.forEach(project => {
			if (project.filterCheck()) project.show();
			else project.hide();
		});
	}
}
const projects = new Projects();
