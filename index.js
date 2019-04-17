class ImageClass {
  constructor(config) {
    const { src, width, height, context } = config;

    this.image = new Image();
    this.src = src;
    this.imageData = [];
    this.isLoaded = false;
    this.speed = 1;
    this.context = config.context;

    this.image.onload = () => {
      context.drawImage(this.image, 0, 0);
      this.imageData = context.getImageData(0, 0, width, height);
      this.isLoaded = true;
      var event = new Event('loaded');
      window.dispatchEvent(event);
    };

    this.image.src = this.src;
  }

  getPixel(x, y) {
    return this.context.getImageData(x, y, 1, 1).data;
  }
}

(() => {
  const canvas = document.getElementById('canvas');
  const colorPicker = document.getElementById('color-picker');
  const context = canvas.getContext('2d');
  const WINDOW_COLOR = '#111111';
  const canvasWidth = canvas.width = window.innerWidth * 0.97;
  const canvasHeight = canvas.height = window.innerHeight * 0.86;
  let pixel1 = {r: 0, g: 0, b: 0};
  let pixel2;
  let pixels = [];

  canvas.style.backgroundColor = WINDOW_COLOR;

  const draw = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.putImageData(image.imageData, 0, 0);
  };

  const image = new ImageClass({
    src: './images/mario.png',
    width: canvasWidth,
    height: canvasHeight,
    context,
  });

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  };

  const getDiff = (c1, c2, offset = 60) => {
    if (Math.abs(c1 - c2) < offset) {
      return true;
    }
  };

  window.addEventListener('loaded', () => {
    pixels = image.imageData.data;
  });

  colorPicker.onchange = function() {
    pixel1 = hexToRgb(this.value);
  };

  window.onclick = e => {
    if (!image.isLoaded) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.x;
    const py = e.clientY - rect.y;

      pixel2 = image.getPixel(px, py);

      for (let i = 0; i < pixels.length; i += 4) {
        if (getDiff(pixels[i], pixel2[0])
          && getDiff(pixels[i + 1], pixel2[1])
          && getDiff(pixels[i + 2], pixel2[2])) {
          pixels[i] = pixel1.r;
          pixels[i + 1] = pixel1.g;
          pixels[i + 2] = pixel1.b;
        }
      }
      context.putImageData(image.imageData, 0, 0);
  };
})();
