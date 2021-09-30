export function metersToFeetLabel(meters) {
  var totalInch = (meters * 100) / 2.54;
  var feet = Math.floor(totalInch / 12);
  var inch = Math.floor(totalInch - 12 * feet);
  var labelValue = `${feet}ft ${inch}in`;
  return labelValue;
}

export function compress(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const MAX_WIDTH = 200;
      const MAX_HEIGHT = 150;
      var top = 0,
        left = 0;
      var width = img.width;
      var height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          canvas.width = MAX_WIDTH;
          canvas.height = MAX_HEIGHT;
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
          top = (MAX_HEIGHT - height) / 2;
        } else {
          canvas.width = width;
          canvas.height = width;
          top = (width - height) / 2;
        }
      } else {
        if (height > MAX_HEIGHT) {
          canvas.width = MAX_WIDTH;
          canvas.height = MAX_HEIGHT;
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
          left = (MAX_WIDTH - width) / 2;
        } else {
          canvas.width = height;
          canvas.height = height;
          left = (height - width) / 2;
        }
      }
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, left, top, width, height);
      var newImageSrc = ctx.canvas.toDataURL("image/jpeg", 0.7);
      resolve(newImageSrc);
    };
  });
}