const fs = require("fs"),
  request = require("request"),
  http = require("https"),
  cheerio = require("cheerio"),
  compress_images = require("compress-images");

const date = `130323`;

const linksOriginal = `https://semicvetic.com/internet-magazin/cveti/tyulpany/51_zhyeltyy_tyulpan.html
https://semicvetic.com/internet-magazin/cveti/tyulpany/51_tyulpan/51-krasnyy-tyulpan.html
https://semicvetic.com/internet-magazin/bouquets/buket-iz-51-nezhno-rozovoy-rozy-keniya-30-sm.html
https://semicvetic.com/internet-magazin/cveti/buket-iz-51-korallovoy-rozy-keniya-40-sm-.html
https://semicvetic.com/internet-magazin/cveti/gipsofila/15-rozovykh-gipsofil_1621250757.html
https://semicvetic.com/internet-magazin/cveti/buket-iz-belykh-roz-gvozdiki-i-alstromerii-v-rozovoy-plenke.html
https://semicvetic.com/internet-magazin/cveti/rozy/11_roz/buket-iz-11-nezhno-rozovykh-pionovidnykh-roz-swan-grace-s-fistashkoy.html
https://semicvetic.com/internet-magazin/cveti/rozy/25_roz/25_krasnykh_roz_ekvador_60_sm_freedom.html
https://semicvetic.com/internet-magazin/cveti/tyulpany/101_zheltyy_tyulpan.html
https://semicvetic.com/internet-magazin/p_samye_svezhie_tsvety/buket-iz-25-rozovykh-pionovidnykh-tyulpanov-v-sirenevoy-plenke.html
https://semicvetic.com/internet-magazin/cveti/tyulpany/101_tyulpan/101_krasnyy_tyulpan.html
https://semicvetic.com/internet-magazin/cveti/buket-iz-15-persikovykh-pionovidnykh-roz-flash-back-40-sm-v-kremovoy-plenke.html
https://semicvetic.com/internet-magazin/cveti/rozy/9_roz/9_nezhno_rozovykh_pionovidnykh_roz_swan_grace_s_fistashkoy.html
https://semicvetic.com/internet-magazin/cveti/rozy/rozy_keniya/buket-iz-75-krasnykh-roz-keniya-30-sm.html`;

const links = linksOriginal.replace(/.html\n/g, `.html,`).split(`,`);

const getImage = (url, numberOfItem) => {
  request(url, function (error, response, body) {
    if (!error) {
      setTimeout(() => {
        const $ = cheerio.load(body);
        const img =
          $(".slider_photo_product .slick-slide a img").attr("src") != undefined
            ? $(".slider_photo_product a").attr("href")
            : $(".slider_photo_product a").attr("href");

        console.log($.contains(".wrapper_body", ".slider_photo_product"));

        const file = fs.createWriteStream(
          `imagesOriginal/${numberOfItem + 1}--${date}.jpeg`
        );
        const request = http.get(
          `https://semicvetic.com${img}`,
          function (response) {
            response.pipe(file);
          }
        );

        console.log(`https://semicvetic.com${img}, ${url}`);
      }, 2000);
    } else {
      console.log("Произошла ошибка: " + error);
    }
  });
};

const getImageFromArray = (item, numberOfItem) => {
  request(item.img, function (error, response, body) {
    if (!error) {
      setTimeout(() => {
        const file = fs.createWriteStream(
          `imagesOriginal/${numberOfItem + 1}--${date}.jpeg`
        );
        const request = http.get(item.img, function (response) {
          response.pipe(file);
        });

        console.log(`${item.img}`);
      }, 2000);
    } else {
      console.log("Произошла ошибка: " + error);
    }
  });
};

const getImages = async () => {
  let i = 0;

  for (let link of links) {
    await getImage(link, i);
    // await getImageFromArray(link, i);

    if (i + 1 == links.length) {
      console.log(
        `Последняя картинка скачана. Всего – ${links.length} картинок.`
      );
    }

    i++;
  }

  // links.forEach((link, i) => {
  //   getImage(link, i);

  //   if (i + 1 == links.length) {
  //     console.log(
  //       `Последняя картинка скачана. Всего – ${links.length} картинок.`
  //     );
  //   }
  // });
};

getImages();
