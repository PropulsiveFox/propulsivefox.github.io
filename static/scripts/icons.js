const icons = [
	{
		tagName: 'link',
		rel: 'apple-touch-icon',
		sizes: '180x180',
		href: '/static/icons/apple-touch-icon.png'
	},
	{
		tagName: 'link',
		rel: 'icon',
		type: 'image/png',
		sizes: '32x32',
		href: '/static/icons/favicon-32x32.png'
	},
	{
		tagName: 'link',
		rel: 'icon',
		type: 'image/png',
		sizes: '16x16',
		href: '/static/icons/favicon-16x16.png'
	},
	{
		tagName: 'link',
		rel: 'manifest',
		href: '/static/icons/site.webmanifest'
	},
	{
		tagName: 'link',
		rel: 'mask-icon',
		href: '/static/icons/safari-pinned-tab.svg',
		color: '#2fafef'
	},
	{
		tagName: 'link',
		rel: 'shortcut icon',
		href: '/static/icons/favicon.ico'
	},
	{
		tagName: 'meta',
		name: 'apple-mobile-web-app-title',
		content: 'Projects.PropulsiveFox'
	},
	{
		tagName: 'meta',
		name: 'application-name',
		content: 'Projects.PropulsiveFox'
	},
	{
		tagName: 'meta',
		name: 'theme-color',
		content: '#1f1f2f'
	}
]

const iconsHTML = new Array();
icons.forEach(line => {
	let element = document.createElement(line.tagName);
	for (let property in line) {
		if (property === 'tagName') continue;

		element[property] = line[property];
	}
	iconsHTML.push(element);
});

const iconsScriptElement = document.head.querySelector('#icons-script');
iconsHTML.forEach(element => iconsScriptElement.before(element));
