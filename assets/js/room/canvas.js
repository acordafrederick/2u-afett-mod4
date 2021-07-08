export const renderCanvas = (canvasEl) => {
  const ctx = canvasEl.getContext("2d");

  //   ctx.fillStyle = "rgb(200, 0, 0)";
  //   ctx.fillRect(10, 10, 50, 50);

  //   ctx.beginPath();
  //   ctx.arc(100, 75, 50, 0, 2 * Math.PI);
  //   ctx.stroke();
  //   ctx.closePath();

  // set offset and step values
  let offsetX = 0;
  let step = 3;

  const draw = () => {
    // set step direction of offset so it moves back and forth on the screen
    if (offsetX === ctx.canvas.width) {
      step = -3;
    } else if (offsetX === 0) {
      step = 3;
    }
    // update offsetX value based on step direction
    offsetX += step;

    // clear the screen
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.beginPath();
    ctx.arc(offsetX, 75, 25, 0, 2 * Math.PI);
    // ctx.strokeWidth(2);
    ctx.stroke();
    ctx.closePath();

    // call `draw` function on every animation frame in the browser (30 frames per second)
    window.requestAnimationFrame(draw);
  };

  draw();
};
