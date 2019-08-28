export default function rgbToHex(rgb) {
  const rgbArray = rgb.split('(')[1].split(')')[0].split(',');
  const hexValues =  rgbArray.map(function(x){
      x = parseInt(x).toString(16);
      return (x.length==1) ? "0"+x : x;
  })
  return `#${hexValues.join('')}`;
}
