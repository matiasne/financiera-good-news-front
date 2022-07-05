//DEFAULTS
const siteName = "Financiera Good News"
const baseUrl = "https://lalogold.com";
const defaultLang = 'ES';
const preview = '/favicon/android-icon-192x192.png';
const brandColor = '#fff';
const brandColorBg = '#fff'
const keywords = "";
const author = "Lalo Gold - lalogold.com";
const copyright = "Good News 2021";
const description = {
	ES: 'Software boutique. Diseño y desarrollo web.',
};

const routes = [""];
const locale = {
	ES: 'es_AR',
	// EN: 'en_US',
};
const googleId = null;




export default function Headings({pageTitle = '', desc = '', url = '', image = ''}) {
	const statics = [
		<meta key="utf" charSet="utf-8" />,
		<meta key="robots" name="robots" content="index, follow" />,

		<link rel="apple-touch-icon" key="57" sizes="57x57" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="60" sizes="60x60" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="72" sizes="72x72" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="76" sizes="76x76" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="114" sizes="114x114" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="120" sizes="120x120" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="144" sizes="144x144" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="152" sizes="152x152" href="/favicon/goldco-favicon.svg" />,
		<link rel="apple-touch-icon" key="180" sizes="180x180" href="/favicon/goldco-favicon.svg" />,
		<link rel="icon" type="image/png" key="192" sizes="192x192" href="/favicon/goldco-favicon.svg" />,
		<link rel="icon" type="image/png" key="32" sizes="32x32" href="/favicon/goldco-favicon.svg" />,
		<link rel="icon" type="image/png" key="96" sizes="96x96" href="/favicon/goldco-favicon.svg" />,
		<link rel="icon" type="image/png" key="16" sizes="16x16" href="/favicon/goldco-favicon.svg" />,
		<meta name="msapplication-TileImage" key="144" content="/favicon/goldco-favicon.svg" />,
		<link key="manifest" rel="manifest" href="/favicon/manifest.json" />,

		<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color={brandColor} />,
		<meta key="theme1" name="msapplication-TileColor" content={brandColorBg} />,
		<meta key="theme2" name="theme-color" content={brandColor} />,
		<meta key="theme3" name="theme-color" content={brandColor} />,
		<meta key="author" name="author" content={author} />,
		<meta key="copyright" name="copyright" content={copyright} />,
		<meta key="type" property="og:type" content="website" />,

		<meta key="keywords" name="keywords" content={keywords} />,
	]

	let title = siteName;
	if (pageTitle) {
		title = pageTitle + ' • ' + title;
	}

	return (
		<>
			<title>{title}</title>
			<meta key="og:title" property="og:title" content={title} />
			<meta key="og:site_name" property="og:site_name" content={siteName} />
			<meta key="description" name="description" content={desc || description[defaultLang]} />
			<meta key="og:description" property="og:description" content={desc || description[defaultLang]} />
			<meta key="lang" name="lang" content={defaultLang.toLowerCase()} />
			<meta key="og:locale" property="og:locale" content={locale[defaultLang]} />
			<meta key="og:url" property="og:url" content={baseUrl + url} />
			<link key="image_src" rel="image_src" href={image || preview} />
			<meta key="og:image" property="og:image" content={image || preview} />

			{statics}

			{Canonicals()}


			{googleId && <script async src={"https://www.googletagmanager.com/gtag/js?id=" + googleId}></script>}

			{googleId && <script dangerouslySetInnerHTML={
				{
					__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', '${googleId}');
					`}
			} />}


		</>
	)
}

export function Canonicals(isPlain = false) {
	let res = [];

	routes.map(route => {
		if (isPlain) {
			res.push(CanonicalRoute(route));
		} else {
			res.push(<link rel="canonical" href={CanonicalRoute(route)} />);
		}

		const locales = Object.keys(locale);
		locales.length > 1 && locales.map((lang) => {
			let newRoute = '/' + lang.toLowerCase() + route;
			if (isPlain) {
				res.push(CanonicalRoute(newRoute));
			} else {
				res.push(<link rel="canonical" href={CanonicalRoute(newRoute)} />);
			}
		})

	})

	return res
}

function CanonicalRoute(route) {
	return baseUrl + route;
}
