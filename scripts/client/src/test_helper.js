// Added some code that will convert RGB to Hex, and vice versa, credit to Tim Down: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
  
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Parse color from: https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
export function parseColor(input) {
    return input.split("(")[1].split(")")[0].split(",");
}

export function parseRGBConvertToHex(input) {
    let rgb_colors = parseColor(input);
    let red = Number(rgb_colors[0]);
    let green = Number(rgb_colors[1]);
    let blue = Number(rgb_colors[2]);

    return rgbToHex(red, green, blue);
}
