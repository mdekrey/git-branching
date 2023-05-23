export function downloadSvg(svgElement: SVGElement) {
  const windowUrl = window.URL || (window as any).webkitURL;

  const originalSvg = new Blob([svgElement.outerHTML], {
    type: "image/svg+xml;charset=utf-8"
  });
  const url = windowUrl.createObjectURL(originalSvg);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${svgElement.getAttribute("data-name") || "git"}.svg`
  );
  document.body.appendChild(link);
  link.click();
  setTimeout(function() {
    windowUrl.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 100);
}
