const fs = require("fs"),
	request = require("request"),
	http = require("https"),
	cheerio = require("cheerio");

const utm = ``;
// const utm = `?US_COUPON=SUPERGIFT5`;
const date = `130323`;
const theme = `Семицветик`;
const preheader = `С максимальной скидкой `;
const discountDesc = ``;
const discountCode = ``;

const linksOriginal = `https://semicvetic.com/internet-magazin/cveti/tyulpany/51_zhyeltyy_tyulpan.html
https://semicvetic.com/internet-magazin/bouquets/buket-iz-51-nezhno-rozovoy-rozy-keniya-30-sm.html
https://semicvetic.com/internet-magazin/cveti/rozy/rozy_v_upakovke/buket-iz-51-rozy-miks-keniya-35-40-sm-v-goluboy-plenke.html
https://semicvetic.com/internet-magazin/cveti/buket-iz-51-korallovoy-rozy-keniya-40-sm-.html
https://semicvetic.com/internet-magazin/cveti/gipsofila/15-rozovykh-gipsofil_1621250757.html
https://semicvetic.com/internet-magazin/cveti/buket-iz-belykh-roz-gvozdiki-i-alstromerii-v-rozovoy-plenke.html
https://semicvetic.com/internet-magazin/cveti/rozy/11_roz/buket-iz-11-nezhno-rozovykh-pionovidnykh-roz-swan-grace-s-fistashkoy.html
https://semicvetic.com/internet-magazin/cveti/rozy/25_roz/25_krasnykh_roz_ekvador_60_sm_freedom.html
https://semicvetic.com/internet-magazin/cveti/tyulpany/101_zheltyy_tyulpan.html
https://semicvetic.com/internet-magazin/bouquets/buket-iz-25-sinikh-irisov-v-goluboy-plenke.html
https://semicvetic.com/internet-magazin/cveti/gvozdiki/15_rozovykh_gvozdik.html
https://semicvetic.com/internet-magazin/cveti/buket-iz-15-persikovykh-pionovidnykh-roz-flash-back-40-sm-v-kremovoy-plenke.html
https://semicvetic.com/internet-magazin/cveti/rozy/9_roz/9_nezhno_rozovykh_pionovidnykh_roz_swan_grace_s_fistashkoy.html`;

const links = linksOriginal.replace(/.html\n/g, `.html,`).split(`,`);

const imagesOriginal = `https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/1--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/2--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/3--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/4--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/5--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/6--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/7--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/8--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/9--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/10--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/11--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/12--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/13--${date}.jpeg
https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/14--${date}.jpeg`;

const images = imagesOriginal.replace(/\n/g, `,`).split(`,`);

const cleanName = (name) => {
	let newName = name;
	let unnecessaryWords = {
		"Букет из ": "",
		Standart: "",
		Standart: "",
		"30 см": "",
		"40 см": "",
		"50 см": "",
		"60 см": "",
		"70 см": "",
		"80 см": "",
		"с фисташкой": "",
		фисташкой: "",
		микс: "",
		"Swan Grace": "",
		"Flash back": "",
		"Flash Back": "",
		пионовидных: "",
		"в упаковке": "",
		красной: "",
		белой: "",
		синих: "",
		голубых: "",
		оранжевой: "",
		розовых: "",
		нежно: "",
		яркий: "",
		"-": "",
		персиковых: "",
		кремовых: "",
		"(": "",
		")": "",
		Эквадор: "",
		Кения: "",
		Россия: "",
		кустовых: "",
		Plus: "",
		Freedom: "",
		"с эвкалиптом": "",
		одноголовых: "",
		"White O'Hara": "",
		"Deep Purple": "",
		белых: "",
		красных: "",
		каймой: "",
		сиреневых: "",
		сиреневых: "",
		розовой: "",
		оранжевых: "",
		розовой: "",
		оранжевых: "",
		"с темной каймой": "",
		Vendela: "",
		"Red Piano": "",
		Букет: "",
		коробке: "",
		шляпной: "",
		"Amour Mini": "",
		Premium: "",
		ярких: "",
		тонах: "",
		Premium: "",
		Premium: "",
		Premium: "",
		радужных: "",
		" из ": "",
		" с ": "",
		" в ": "",
		" ,": ",",
		"   ": " ",
		"  ": " ",
		"  ": " ",
		"  ": " ",
		"  ": " ",
		"  /n": "",
		" /n": "",
		" /n": "",
		"/n": "",
		"25 роз елью, корицей и апельсиномкрафте": "25 роз",
		"11 роз елью и хлопкомкрафте": "11 роз",
		"7 мандаринами, хлопком и корицейкрафте": "Новогодний букет",
		"гортензии, 7 роз, лизиантусов": "Букет из 3-х цветов",
		"гортензии, пионовидной розы и гвоздикикремовой пленке":
			"Букет из 3-х цветов",
		"25 альстромерий": "25<br>альстромерий",
		"151 розы": "151 роза<br>&nbsp;",
		"15 роз": "15 роз<br>&nbsp;",
		"15 гипсофил": "15 гипсофил<br>&nbsp;",
	};

	Object.entries(unnecessaryWords).forEach((entry) => {
		const [key, value] = entry;

		newName = newName.split(key).join(value);
	});

	// console.log(newName);

	return newName;
};

// const getGood = (url, imgQuality = `max`)
const getGoodFromRequest = (url, imageURL, numberOfItem) => {
	let good = {
		img: `${imageURL}`,
		name: ``,
		priceRegular: ``,
		priceNew: ``,
		priceWidthExtraDiscount: ``,
		discount: ``,
		link: `${url}${utm}`,
	};

	return new Promise(function (resolve, reject) {
		request(url, function (error, response, body) {
			if (url === `*.html`) {
				good.img = `undefined`;
				good.name = `undefined`;
				good.priceRegular = `undefined`;
				good.priceNew = `undefined`;
				good.priceWidthExtraDiscount = `undefined`;
				good.discount = `undefined`;
				good.link = `undefined`;
			} else {
				if (!error) {
					let $ = cheerio.load(body),
						name = $(".options_product .item_name_detail").html(),
						priceRegular = $(".finish_price_product .old_price_product").text(),
						priceNew = $(".finish_price_product .new_price").text(),
						priceNormal = $(".finish_price_product .normal_price").text(),
						img =
							$(".slider_photo_product .slick-slide a img").attr("src") !=
								undefined
								? $(".slider_photo_product a").attr("href")
								: $(".slider_photo_product a").attr("href");

					let imgMin;

					good.name = name;

					if (priceNew == ``) {
						good.priceRegular = priceNormal.replace(/руб/gi, "");
						good.priceNew = priceNormal.replace(/руб/gi, "");
						good.priceWidthExtraDiscount = getDiscount(
							convertPriceToNumber(priceNormal.replace(/руб/gi, "")),
							convertPriceToNumber(priceNormal.replace(/руб/gi, "")),
							true
						);
						good.discount = getDiscount(
							convertPriceToNumber(priceNormal.replace(/руб/gi, "")),
							convertPriceToNumber(priceNormal.replace(/руб/gi, ""))
						);
					} else {
						good.priceRegular = priceRegular.replace(/руб/gi, "");
						good.priceNew = priceNew.replace(/руб/gi, "");
						good.priceWidthExtraDiscount = getDiscount(
							convertPriceToNumber(priceRegular.replace(/руб/gi, "")),
							convertPriceToNumber(priceNew.replace(/руб/gi, "")),
							true
						);
						good.discount = getDiscount(
							convertPriceToNumber(priceRegular.replace(/руб/gi, "")),
							convertPriceToNumber(priceNew.replace(/руб/gi, ""))
						);
					}

					// console.log(good);
					resolve(good);
				} else {
					reject(error);
				}
			}
		});
	});
};

const getGood = async (url, img = undefined, numberOfItem) => {
	try {
		let newGood = await getGoodFromRequest(url, img, numberOfItem);

		return newGood;
	} catch (error) {
		console.log(error);
	}
};

const convertPriceToNumber = (price) => {
	priceWithoutSpaces = price.split(` `).join(``).toString();
	newPrice = parseInt(priceWithoutSpaces, 10);

	return newPrice;
};

// `discountAdditional` - дополнительная скидка, по умолчанию 5%
const getDiscount = (
	oldPriceNumber,
	newPriceNumber,
	getPrice = false,
	discountAdditional = 5
) => {
	let newPriceNumberWithDiscountAdditional = (newPriceNumber / 100) * 95;
	let discountNumber =
		100 - (newPriceNumberWithDiscountAdditional / oldPriceNumber) * 100;
	let discount = discountNumber.toString().split(`.`)[0];
	let discountPrice;

	if (newPriceNumberWithDiscountAdditional.toString().length > 3) {
		let discountPriceFixed;

		if (newPriceNumberWithDiscountAdditional.toString().includes(`.`)) {
			discountPriceFixed = (newPriceNumberWithDiscountAdditional + 1)
				.toString()
				.split(`.`)[0];
		} else {
			discountPriceFixed = newPriceNumberWithDiscountAdditional;
		}

		let thirdCharacterFromTheEnd = discountPriceFixed
			.toString()
			.substring(discountPriceFixed.toString().length - 3);

		discountPrice = discountPriceFixed
			.toString()
			.split(thirdCharacterFromTheEnd)
			.join(` ${thirdCharacterFromTheEnd}`);
	} else {
		discountPrice = newPriceNumberWithDiscountAdditional;
	}

	if (getPrice) {
		return discountPrice;
	} else {
		return discount;
	}
};

const getGoods = async () => {
	let goods = [{}];
	let i = 0;

	for (const link of links) {
		let item = await getGood(link, images[i], i);
		goods.push(item);
		i++;
	}

	return goods;
};

const newGoods = async () => {
	const makeMail = (goodsList) => {
		const goods = goodsList;
		const mainGood = goodsList[goodsList.length - 1];

		const getPrice = (v = 1) => {
			// let res = 0;
			let regP = +mainGood.priceRegular.split(` `).join(``);
			let newP = +mainGood.priceNew.split(` `).join(``);

			switch (v) {
				case 1:
					// цена с 2-мя скидками
					var resS = (+newP / 100) * 90;
					console.log(1, (newP / 100) * 90);

					break;

				case 2:
					// сумма 2 скидок
					var resS = +regP - +newP + (+newP / 100) * 10;
					console.log(2, +regP - +newP + (+newP / 100) * 10);

					break;

				case 3:
					// скидка букет
					var resS = +newP - (+newP / 100) * 90;
					console.log(3, newP - (+newP / 100) * 90);

					break;

				case 4:
					// скидка стандарт
					var resS = +regP - +newP;
					console.log(4, +regP - +newP);

					break;

				case 5:
					// процент скидок
					var resS = 100 - ((+newP / 100) * 90) / (+regP / 100);
					console.log(5, 100 - ((+newP / 100) * 90) / (+regP / 100));

					break;

				case 6:
					// процент скидок обычный
					var resS = 100 - +newP / (+regP / 100);
					console.log(5, 100 - +newP / (+regP / 100));

					break;

				case 7:
					// вы экономите (1 скидка)
					var resS = +regP - +newP;
					console.log(2, +regP - +newP);

					break;
			}

			// console.log(regP, newP, resS);

			return resS;
		};

		// console.log(priceRegNumber, priceNewNumber);

		// с доп скидкой 10%
		setTimeout(() => {
			fs.writeFile(`7k__${date}.html`, "", function (err) {
				if (err) return console.log(err);

				let html = `<!DOCTYPE html>
	<html lang="ru">
	
	<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="format-detection" content="telephone=no" />
	<meta name="format-detection" content="address=no" />
	<meta name="format-detection" content="email=no" />
	
	<title>${theme}</title>
	
	<style>
	* .banner img+div {
		display: none !important;
	}
	
	* img {
		image-rendering: -webkit-optimize-contrast !important;
	}
	
	.row .container {
		display: inline-block !important;
		width: 100% !important;
		max-width: 660px !important;
	}
	
	.row .row__td {
		display: none !important;
	}
	
	@media (min-width: 660px) {
		img {
			image-rendering: -webkit-optimize-contrast !important;
		}
	
		.col {
			line-height: 0 !important;
		}
	}
	
	@media (max-width: 660px) {
		img {
			image-rendering: -webkit-optimize-contrast !important;
		}
	
		.mobile-hidden {
			display: none !important;
		}
	}
	
	</style>
	</head>
	
	<body style="margin: 0; padding: 0; background-color: #F7F3F2;">
	<div class="preheader" style="height: 0px; margin: 0 auto; padding: 0; font-size: 0px; color: transparent; opacity: 0;">${preheader}
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	</div>
	
	<div itemscope itemtype="http://schema.org/Organization">
		<meta itemprop="name" content="Семицветик" />
		<meta itemprop="logo" content="https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/logo%20(61e711be97a5250f84d6cf8b).png" />
	</div>
	<div itemscope itemtype="http://schema.org/DiscountOffer">
		<meta itemprop="description" content="скидка ${discountDesc}" />
		<meta itemprop="discountCode" content="${discountCode}" />
	</div>
	<div itemscope itemtype="http://schema.org/EmailMessage">
		<meta itemprop="subjectLine" content="${preheader}" />
	</div>
	
	<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" style="min-width: 660px;">
	<tr class="row" style="text-align: center;">
	<td class="row__td"></td>
	<td class="container" width="660" style="max-width: 660px; margin: 0 auto; padding: 0; padding-top: 30px;">
	<div style="display: block; width: 660px; max-width: 660px; min-width: 660px; margin: 0 auto; padding: 0;">
	<table cellpadding="0" cellspacing="0" width="660" style="table-layout: fixed; width: 660px; max-width: 660px; min-width: 660px;">
	<tr>
		<td class="block-wrapper" style="padding: 0; padding-bottom: 30px; padding-left: 6%; padding-right: 6%;">
			<table class="header" cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td class="col" width="60%" valign="middle" style="padding: 0; text-align: left;">
						<a href="https://semicvetic.com/">
							<img src="https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/logo%20(61e711be97a5250f84d6cf8b).png" width="300" height="74" style="width: 100%; max-width: 300px; height: auto; max-height: 74px;" alt="Семицветик">
						</a>
					</td>
					<td class="col" width="40%" valign="middle" style="padding: 0; text-align: right;">
						<div>
							<!--[if mso]>
							<v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://semicvetic.com/" style="height: 42px; v-text-anchor: middle; width: 164px;" stroke="f" fillcolor="#66DA2B">
							<w:anchorlock/>
							<center>
							<![endif]-->
							<a href="https://semicvetic.com/" style="display: inline-block; width: auto; min-width: 100px; max-width: 232px; padding-left: 19px; padding-right: 19px; text-align: center; color: #1B243B; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 42px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.04em; text-decoration: none; background-color: #C3ECBA;background-image: #C3ECBA; background: #C3ECBA; border-top-left-radius: 40px; border-top-right-radius: 40px; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; box-shadow: 0px 0px 30px rgba(255, 255, 255, 0.7); -webkit-text-size-adjust: none;">
								Выбрать букет
							</a>
							<!--[if mso]>
							</center>
							</v:rect>
							<![endif]-->
						</div>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	
	<tr>
		<td class="block-wrapper" style="padding: 0; padding-top: 0; padding-bottom: 40px;">
		<table class="block block--promo" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFFFF" style="box-shadow: 0px 0px 10px rgba(206, 209, 213, 0.15);
        border-radius: 10px;">
        <tr>
            <td class="menu-wrapper" style="padding: 0; padding-top: 40px; padding-bottom: 30px; padding-left: 3%; padding-right: 3%;">
            <table class="menu" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td class="menu__item" width="25%" valign="top" style="padding: 0; text-align: center;">
                    <div style="margin: 0 auto; text-align: center;">
						<a href="https://semicvetic.com/internet-magazin/povod/" style="display: inline-block; width: auto; padding: 0; padding-bottom: 1px; padding-left: 20px; padding-right: 20px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 22px; line-height: 33px; color: #464646; font-weight: 300; text-decoration: none; background-color: #F5F5F5; border-radius: 20px;">
							#Повод
						</a>
                    </div>
                </td>
                <td class="menu__item" width="25%" valign="top" style="padding: 0; text-align: center;">
                    <div style="margin: 0 auto; text-align: center;">
                        <a href="https://semicvetic.com/internet-magazin/cveti/rozy/" style="display: inline-block; width: auto; padding: 0; padding-bottom: 1px; padding-left: 20px; padding-right: 20px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 22px; line-height: 33px; color: #464646; font-weight: 300; text-decoration: none; background-color: #F5F5F5; border-radius: 20px;">
                            #Розы
                        </a>
                    </div>
                </td>
                <td class="menu__item" width="25%" valign="top" style="padding: 0; text-align: center;">
                    <div style="margin: 0 auto; text-align: center;">
                        <a href="https://semicvetic.com/" style="display: inline-block; width: auto; padding: 0; padding-bottom: 1px; padding-left: 20px; padding-right: 20px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 22px; line-height: 33px; color: #464646; font-weight: 300; text-decoration: none; background-color: #F5F5F5; border-radius: 20px;">
                            #Хиты
                        </a>
                    </div>
                </td>
                <td class="menu__item" width="25%" valign="top" style="padding: 0; text-align: center;">
                    <div style="margin: 0 auto; text-align: center;">
                        <a href="https://semicvetic.com/internet-magazin/cveti/akcii/" style="display: inline-block; width: auto; padding: 0; padding-bottom: 1px; padding-left: 20px; padding-right: 20px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 22px; line-height: 33px; color: #464646; font-weight: 300; text-decoration: none; background-color: #F5F5F5; border-radius: 20px;">
                            #Акции
                        </a>
                    </div>
                </td>
            </tr>
            </table>
            </td>
        </tr>

			<tr>
				<td class="title-wrapper" style="padding: 0; padding-top: 30px; padding-bottom: 28px; padding-left: 6%; padding-right: 6%; text-align: left;">
					<span class="title" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; line-height: 1.2; color: #1B243B; font-weight: 600;">
						🔥 -5% на&nbsp;Топ&nbsp;продаж
					</span>
				</td>
			</tr>
			<tr>
				<td class="text-wrapper" style="padding: 0; padding-bottom: 42px; padding-left: 6%; padding-right: 6%; text-align: left;">
					<span class="text" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 22px; line-height: 1.6; font-weight: 350; color: #464646;">
						Это самые популярные буĸеты на&nbsp;сегодняшний&nbsp;день. Используй промоĸод <b style="display: inline-block; color: #1B243B; font-weight: 600; background-color: #DAF9D3;">SUPERGIFT5</b>, чтобы получить дополнительную сĸидĸу&nbsp;5% при&nbsp;заказе от&nbsp;2200₽.
					</span>
				</td>
			</tr>
			<tr>
				<td class="goods goods--lg" style="padding: 0; padding-bottom: 30px; padding-left: 3%; padding-right: 3%;">
				<table cellpadding="0" cellspacing="0" width="100%">
				<tr style="font-size: 0; text-align: center;">
					<td class="col col--1" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[1].link}">
										<img class="img" src="${goods[1].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[1].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[1].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[1].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[1].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[1].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
					<td class="col col--2" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[2].link}">
										<img class="img" src="${goods[2].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[2].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[2].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[2].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[2].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[2].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
				</tr>
				</table>
				<table cellpadding="0" cellspacing="0" width="100%">
				<tr style="font-size: 0; text-align: center;">
					<td class="col col--1" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[3].link}">
										<img class="img" src="${goods[3].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[3].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[3].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[3].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[3].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[3].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
					<td class="col col--2" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[4].link}">
										<img class="img" src="${goods[4].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[4].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[4].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[4].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[4].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[4].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
				</tr>
				</table>
				<table cellpadding="0" cellspacing="0" width="100%">
				<tr style="font-size: 0; text-align: center;">
					<td class="col col--1" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[5].link}">
										<img class="img" src="${goods[5].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[5].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[5].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[5].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[5].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[5].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
					<td class="col col--2" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[6].link}">
										<img class="img" src="${goods[6].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[6].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[6].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[6].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[6].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[6].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
				</tr>
				</table>
				<table cellpadding="0" cellspacing="0" width="100%">
				<tr style="font-size: 0; text-align: center;">
					<td class="col col--1" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[7].link}">
										<img class="img" src="${goods[7].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[7].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[7].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[7].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[7].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[7].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
					<td class="col col--2" valign="top" width="300" style="display: inline-block; width: 300px; padding: 0; padding-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					<td class="col__container" width="280" style="padding: 0;">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 0; padding-bottom: 20px; text-align: center;">
									<a href="${goods[8].link}">
										<img class="img" src="${goods[8].img
					}" width="280" height="280" style="width: 100%; max-width: 280px; height: auto; max-height: 280px; border-radius: 10px;" alt="">
									</a>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-bottom: 12px; padding-left: 0px; padding-right: 0px;">
									<table cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 0; text-align: left;">
												<span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
													${goods[8].priceRegular} Р</span>
												&nbsp;
												<a href="${goods[8].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
													<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
														${goods[8].priceNew} Р
													</span>
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style="padding: 0; padding-left: 10px; padding-right: 10px; text-align: left;">
									<a href="${goods[8].link
					}" style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
										${goods[8].name}
									</a>
								</td>
							</tr>
						</table>
					</td>
					<td class="col__padding" width="10" valign="top" style="padding: 0; font-size: 0; line-height: 0;"></td>
					</tr>
					</table>
					</td>
				</tr>
				</table>
				</td>
			</tr>
			</table>
		</td>
	</tr>

	<tr>
		<td class="block-wrapper" style="padding: 0; padding-bottom: 40px;">
			<table class="block block--fresh" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFFFF" style="box-shadow: 0px 0px 10px rgba(206, 209, 213, 0.15);
			border-radius: 10px;">
			<tr>
				<td class="title-wrapper" style="padding: 0; padding-top: 50px; padding-bottom: 28px; padding-left: 6%; padding-right: 6%; text-align: left;">
					<span class="title" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 50px; line-height: 1.2; color: #1B243B; font-weight: 600;">
						🚀 Свежая поставĸа
					</span>
				</td>
			</tr>
			<tr>
				<td class="text-wrapper" style="padding: 0; padding-bottom: 20px; padding-left: 6%; padding-right: 6%; text-align: left;">
					<span class="text" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 22px; line-height: 1.6; font-weight: 350; color: #464646;">
						Эти буĸеты тольĸо&#8209;тольĸо пустили в&nbsp;продажу. <br>
						Присмотритесь внимательно, вдруг именно&nbsp;здесь вы&nbsp;найдете&nbsp;нужный ❤️
					</span>
				</td>
			</tr>
			<tr>
				<td class="goods goods--list" style="padding: 0; padding-top: 20px; padding-bottom: 20px; padding-left: 6%; padding-right: 6%;">
					<table class="goods__item" cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td style="padding: 0; padding-bottom: 30px;">
							<table cellpadding="0" cellspacing="0" width="100%">
								<tr style="font-size: 0; text-align: center;">
									<td class="col goods__img" valign="top" width="140" style="padding: 0; text-align: left;">
										<a href="${goods[9].link}">
											<img src="${goods[9].img
					}" width="130" height="130" style="width: 100%; max-width: 130px; height: auto; max-height: 130px; border-radius: 50%;" alt="">
										</a>
									</td>
									<td class="col goods__info" valign="top" width="240" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; padding-bottom: 10px; padding-left: 10px; padding-right: 0; text-align: left;">
													<a href="${goods[9].link
					}" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
														${goods[9].name}
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 0; padding-left: 10px; text-align: left;">
													<span style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
														${goods[9].priceRegular} Р</span>
													&nbsp;
													<a href="${goods[9].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
														<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
															${goods[9].priceNew} Р
														</span>
													</a>
												</td>
											</tr>
										</table>
									</td>
									<td class="col goods__button" valign="top" width="160" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; text-align: right;">
													<div>
														<!--[if mso]>
														<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${goods[9].link
					}" style="height:50px;v-text-anchor:middle;width:150px;" arcsize="2%" stroke="f" fillcolor="#F7F3F2">
														<w:anchorlock/>
														<center>
														<![endif]-->
														<a href="${goods[9].link
					}" style="background-color:#F7F3F2;border-radius:10px;color:#1B243B;display:inline-block;font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 400;line-height:46px;text-align:center;text-decoration:none;width:140px;text-transform: uppercase; letter-spacing: 0.04em;-webkit-text-size-adjust:none;">
															Купить
														</a>
														<!--[if mso]>
														</center>
														</v:roundrect>
														<![endif]-->
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					</table>
					<table class="goods__item" cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td style="padding: 0; padding-bottom: 30px;">
							<table cellpadding="0" cellspacing="0" width="100%">
								<tr style="font-size: 0; text-align: center;">
									<td class="col goods__img" valign="top" width="140" style="padding: 0; text-align: left;">
										<a href="${goods[10].link}">
											<img src="${goods[10].img
					}" width="130" height="130" style="width: 100%; max-width: 130px; height: auto; max-height: 130px; border-radius: 50%;" alt="">
										</a>
									</td>
									<td class="col goods__info" valign="top" width="240" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; padding-bottom: 10px; padding-left: 10px; padding-right: 0; text-align: left;">
													<a href="${goods[10].link
					}" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
														${goods[10].name}
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 0; padding-left: 10px; text-align: left;">
													<span style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
														${goods[10].priceRegular} Р</span>
													&nbsp;
													<a href="${goods[10].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
														<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
															${goods[10].priceNew} Р
														</span>
													</a>
												</td>
											</tr>
										</table>
									</td>
									<td class="col goods__button" valign="top" width="160" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; text-align: right;">
													<div>
														<!--[if mso]>
														<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${goods[10].link
					}" style="height:50px;v-text-anchor:middle;width:150px;" arcsize="2%" stroke="f" fillcolor="#F7F3F2">
														<w:anchorlock/>
														<center>
														<![endif]-->
														<a href="${goods[10].link
					}" style="background-color:#F7F3F2;border-radius:10px;color:#1B243B;display:inline-block;font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 400;line-height:46px;text-align:center;text-decoration:none;width:140px;text-transform: uppercase; letter-spacing: 0.04em;-webkit-text-size-adjust:none;">
															Купить
														</a>
														<!--[if mso]>
														</center>
														</v:roundrect>
														<![endif]-->
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					</table>
					<table class="goods__item" cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td style="padding: 0; padding-bottom: 30px;">
							<table cellpadding="0" cellspacing="0" width="100%">
								<tr style="font-size: 0; text-align: center;">
									<td class="col goods__img" valign="top" width="140" style="padding: 0; text-align: left;">
										<a href="${goods[11].link}">
											<img src="${goods[11].img
					}" width="130" height="130" style="width: 100%; max-width: 130px; height: auto; max-height: 130px; border-radius: 50%;" alt="">
										</a>
									</td>
									<td class="col goods__info" valign="top" width="240" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; padding-bottom: 10px; padding-left: 10px; padding-right: 0; text-align: left;">
													<a href="${goods[11].link
					}" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
														${goods[11].name}
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 0; padding-left: 10px; text-align: left;">
													<span style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
														${goods[11].priceRegular} Р</span>
													&nbsp;
													<a href="${goods[11].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
														<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
															${goods[11].priceNew} Р
														</span>
													</a>
												</td>
											</tr>
										</table>
									</td>
									<td class="col goods__button" valign="top" width="160" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; text-align: right;">
													<div>
														<!--[if mso]>
														<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${goods[11].link
					}" style="height:50px;v-text-anchor:middle;width:150px;" arcsize="2%" stroke="f" fillcolor="#F7F3F2">
														<w:anchorlock/>
														<center>
														<![endif]-->
														<a href="${goods[11].link
					}" style="background-color:#F7F3F2;border-radius:10px;color:#1B243B;display:inline-block;font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 400;line-height:46px;text-align:center;text-decoration:none;width:140px;text-transform: uppercase; letter-spacing: 0.04em;-webkit-text-size-adjust:none;">
															Купить
														</a>
														<!--[if mso]>
														</center>
														</v:roundrect>
														<![endif]-->
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					</table>
					<table class="goods__item" cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td style="padding: 0; padding-bottom: 30px;">
							<table cellpadding="0" cellspacing="0" width="100%">
								<tr style="font-size: 0; text-align: center;">
									<td class="col goods__img" valign="top" width="140" style="padding: 0; text-align: left;">
										<a href="${goods[12].link}">
											<img src="${goods[12].img
					}" width="130" height="130" style="width: 100%; max-width: 130px; height: auto; max-height: 130px; border-radius: 50%;" alt="">
										</a>
									</td>
									<td class="col goods__info" valign="top" width="240" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; padding-bottom: 10px; padding-left: 10px; padding-right: 0; text-align: left;">
													<a href="${goods[12].link
					}" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
														${goods[12].name}
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 0; padding-left: 10px; text-align: left;">
													<span style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
														${goods[12].priceRegular} Р</span>
													&nbsp;
													<a href="${goods[12].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
														<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
															${goods[12].priceNew} Р
														</span>
													</a>
												</td>
											</tr>
										</table>
									</td>
									<td class="col goods__button" valign="top" width="160" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; text-align: right;">
													<div>
														<!--[if mso]>
														<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${goods[12].link
					}" style="height:50px;v-text-anchor:middle;width:150px;" arcsize="2%" stroke="f" fillcolor="#F7F3F2">
														<w:anchorlock/>
														<center>
														<![endif]-->
														<a href="${goods[12].link
					}" style="background-color:#F7F3F2;border-radius:10px;color:#1B243B;display:inline-block;font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 400;line-height:46px;text-align:center;text-decoration:none;width:140px;text-transform: uppercase; letter-spacing: 0.04em;-webkit-text-size-adjust:none;">
															Купить
														</a>
														<!--[if mso]>
														</center>
														</v:roundrect>
														<![endif]-->
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					</table>
					<table class="goods__item" cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td style="padding: 0; padding-bottom: 30px;">
							<table cellpadding="0" cellspacing="0" width="100%">
								<tr style="font-size: 0; text-align: center;">
									<td class="col goods__img" valign="top" width="140" style="padding: 0; text-align: left;">
										<a href="${goods[13].link}">
											<img src="${goods[13].img
					}" width="130" height="130" style="width: 100%; max-width: 130px; height: auto; max-height: 130px; border-radius: 50%;" alt="">
										</a>
									</td>
									<td class="col goods__info" valign="top" width="240" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; padding-bottom: 10px; padding-left: 10px; padding-right: 0; text-align: left;">
													<a href="${goods[13].link
					}" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #464646; font-weight: 350; text-decoration: none;">
														${goods[13].name}
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 0; padding-left: 10px; text-align: left;">
													<span style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 34px; color: #8B8B8B; text-decoration: line-through; vertical-align: middle;">
														${goods[13].priceRegular} Р</span>
													&nbsp;
													<a href="${goods[13].link
					}" style="display: inline-block; width: auto; min-width: 80px; margin-left: 10px; padding: 0 10px; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 0px; line-height: 34px; vertical-align: middle; color: #FF5739; text-decoration: none; background-color: #F7F3F2; border-radius: 20px;">
														<span style="vertical-align: middle; font-size: 24px; line-height: 34px; font-weight: 600;">
															${goods[13].priceNew} Р
														</span>
													</a>
												</td>
											</tr>
										</table>
									</td>
									<td class="col goods__button" valign="top" width="160" style="padding: 0;">
										<table cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="padding: 0; padding-top: 14px; text-align: right;">
													<div>
														<!--[if mso]>
														<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${goods[13].link
					}" style="height:50px;v-text-anchor:middle;width:150px;" arcsize="2%" stroke="f" fillcolor="#F7F3F2">
														<w:anchorlock/>
														<center>
														<![endif]-->
														<a href="${goods[13].link
					}" style="background-color:#F7F3F2;border-radius:10px;color:#1B243B;display:inline-block;font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 400;line-height:46px;text-align:center;text-decoration:none;width:140px;text-transform: uppercase; letter-spacing: 0.04em;-webkit-text-size-adjust:none;">
															Купить
														</a>
														<!--[if mso]>
														</center>
														</v:roundrect>
														<![endif]-->
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td class="button-wrapper" style="padding: 0; padding-bottom: 70px; padding-left: 6%; padding-right: 6%; text-align: left;">
					<div style="margin: 0; padding: 0; text-align: left;">
						<!--[if mso]>
						<v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://semicvetic.com/internet-magazin/p_samye_svezhie_tsvety" style="height: 60px; v-text-anchor: middle; width: 580px;" stroke="f" fillcolor="#07A402">
						<w:anchorlock/>
						<center>
						<![endif]-->
						<a href="https://semicvetic.com/internet-magazin/p_samye_svezhie_tsvety" style="display: inline-block; width: 100%; text-align: center; color: #FFFFFF; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 24px; line-height: 60px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; text-decoration: none; background-color: #07A402; background-image: linear-gradient(90deg, #66DA2B 0%, #07A402 100%); background: linear-gradient(90deg, #66DA2B 0%, #07A402 100%); border-top-left-radius: 10px; border-top-right-radius: 10px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; box-shadow: 0px 0px 30px rgba(255, 255, 255, 0.7); -webkit-text-size-adjust: none;">
							Перейти&nbsp;в раздел
						</a>
						<!--[if mso]>
						</center>
						</v:rect>
						<![endif]-->
					</div>
				</td>
			</tr>
			</table>
		</td>
	</tr>

	<tr>
		<td class="block-wrapper" style="padding: 0; padding-bottom: 40px;">
			<table class="block block--info" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFFFF" style="box-shadow: 0px 0px 10px rgba(206, 209, 213, 0.15);
			border-radius: 10px;">
				<tr>
					<td style="padding: 0; padding-top: 30px; padding-bottom: 36px; padding-left: 6%; padding-right: 6%; text-align: left;">
						<span class="text" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 20px; line-height: 1.5; color: #464646; font-weight: 350;">
							Цены на представленные букеты актуальны на&nbsp;момент отправки письма и&nbsp;могут изменяться в&nbsp;течение&nbsp;дня.
						</span>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	
	<tr>
		<td style="padding: 0; padding-top: 30px; padding-bottom: 30px; padding-left: 6%; padding-right: 6%; text-align: left;">
			<a href="tel:+78127706690" style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 28px; line-height: 1.3; color: #464646; font-weight: 600; text-decoration: none;">
				8 (812) 770 66 90
			</a>
		</td>
	</tr>
	<tr>
		<td style="padding: 0; padding-bottom: 30px; padding-left: 4%; padding-right: 4%;">
			<table cellpadding="0" cellspacing="0" width="480">
				<tr style="text-align: center;">
					<td width="25%" style="padding: 0; font-size: 0; line-height: 0; text-align: center;">
						<a href="https://www.youtube.com/channel/UC9wMItaNG0dplEt1OLGtJ_w">
							<img src="https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/icon_you.png" width="96" height="96" alt="yt">
						</a>
					</td>
					<td width="25%" style="padding: 0; font-size: 0; line-height: 0; text-align: center;">
						<a href="https://vk.com/semicvetik">
							<img src="https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/icon_vk.png" width="96" height="96" alt="vk">
						</a>
					</td>
					<td width="25%" style="padding: 0; font-size: 0; line-height: 0; text-align: center;">
						<a href="https://www.tiktok.com/@7micvetic">
							<img src="https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/icon_tik.png" width="96" height="96" alt="tt">
						</a>
					</td>
					<td width="25%" style="padding: 0; font-size: 0; line-height: 0; text-align: center;">
						<a href="https://bit.ly/3vEuD3y">
							<img src="https://gallery.retailrocket.net/5c8ba6d697a5253acc2d4f95/aaatest.png" width="96" height="96" alt="tg">
						</a>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="col" style="padding: 0; padding-bottom: 40px; padding-left: 6%; padding-right: 6%; text-align: left;">
			<span style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.3; color: #978E89;">
				Открыть <a href="{{htmlVersionLink}}" style="color: #464646; text-decoration: underline;">веб-версию письма</a><br><br>
				Если вы больше не хотите получать эти письма, можно <a href="{{unsubscribeUrl}}" style="color: #464646; text-decoration: underline;">отписаться</a>
			</span>
		</td>
	</tr>
	</table>
	</div>
	</td>
	<td class="row__td"></td>
	</tr>
	</table>
	</body>
	
	</html>`;

				fs.appendFile(`7k__${date}.html`, html, function (err) {
					if (err) return console.log(err);
					console.log("Письмо готово!");
				});
			});
		}, 4000);
	};

	makeMail(await getGoods());
};

newGoods();
