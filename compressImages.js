const compress_images = require("compress-images");

function MyFun() {
  compress_images(
      "imagesOriginal/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif,webp}",
      "imagesCompressed/",
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (err, completed) {
      if (completed === true) {
        console.log(`Картинки обжаты!`);
      }
    }
  );
}

MyFun();