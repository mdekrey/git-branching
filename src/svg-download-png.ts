export function downloadSvgAsPng(svgElement: SVGElement) {
  const windowUrl = window.URL || (window as any).webkitURL;

  const img = document.createElement("img");
  const originalSvg = new Blob([svgElement.outerHTML], {
    type: "image/svg+xml;charset=utf-8"
  });
  const svgUrl = windowUrl.createObjectURL(originalSvg);
  img.setAttribute("src", svgUrl);

  img.onload = function() {
    windowUrl.revokeObjectURL(svgUrl);
    const canvas = document.createElement("canvas");
    canvas.height = img.height;
    canvas.width = img.width;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(blob => {
      const url = windowUrl.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${svgElement.getAttribute("data-name") || "git"}.png`
      );
      document.body.appendChild(link);
      link.click();
      setTimeout(function() {
        windowUrl.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    });
  };

  img.onerror = function(arg) {
    windowUrl.revokeObjectURL(svgUrl);
    console.log("error!", arg);
  };
}
