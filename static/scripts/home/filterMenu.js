const filterMenu = {
	opened: false,
	openSpeed: '83',
	closedTimeout: null,
	open() {
		this.element.focus();
		this.element.style.transition = `transform ${this.openSpeed}ms ease-out`;
		this.element.style.transform = 'translate(0, 25px)';
		clearTimeout(this.closedTimeout);
		this.opened = true;
	},
	close() {
		this.element.style.transition = `transform ${this.openSpeed}ms ease-in`;
		this.element.style.transform = 'translate(0, calc(-32px - 100%)';
		this.closedTimeout = setTimeout(() => { this.opened = false; }, this.openSpeed);
	},
	element: document.querySelector('#filter-menu')
};

const filterButton = {
	openAnimate: document.querySelector('#filter-button-icon-open'),
	closeAnimate: document.querySelector('#filter-button-icon-close'),
	open() {
		this.openAnimate.beginElement();
	},
	close() {
		this.closeAnimate.beginElement();
	},
	element: document.querySelector('#filter-button')
}

filterMenu.element.addEventListener('focusout', e => {
	filterButton.close();
	filterMenu.close();
});
filterButton.element.addEventListener('focusin', e => {
	clearTimeout(filterMenu.closedTimeout);
});

filterButton.element.addEventListener('click', filterButtonHandler);
function filterButtonHandler() {
	if (!filterMenu.opened) {
		filterButton.open();
		filterMenu.open();
	} else {
		filterMenu.opened = false;
	}
}

// FilterMenu Debug Open
// filterMenu.element.style.transform = 'translate(0, 25px)';

class Filter {
	constructor(id) {
		this.element = document.querySelector(`.filter-toggle#${id}`);
		if (!this.element) throw new ReferenceError(`Filter named ${id} doesn't exist`);
		this.filterName = id;
		this.applied = true;
	}

	onClick() {
		if (this.applied) {
			this.element.style.filter = 'grayscale(100%)';
			this.applied = false;
		} else {
			this.element.style.filter = 'none';
			this.applied = true;
		}
		projects.update();
	}
}

const filters = [
	new Filter('size-small'),
	new Filter('size-medium'),
	new Filter('size-large'),
	new Filter('type-tool'),
	new Filter('type-demo'),
	new Filter('type-game')
];

filters.forEach(filter => {
	filter.element.addEventListener('click', () => filter.onClick());
});
