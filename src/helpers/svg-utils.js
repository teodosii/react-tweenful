const getDistance = (p1, p2) => {
  const x = Math.pow(p2.x - p1.x, 2);
  const y = Math.pow(p2.y - p1.y, 2);
  return Math.sqrt(x + y);
};

const getCircleLength = el => {
  return Math.PI * 2 * el.getAttribute('r');
};

const getRectLength = el => {
  const width = el.getAttribute('width') * 2;
  const height = el.getAttribute('height') * 2;
  return width + height;
};

const getLineLength = el => {
  return getDistance(
    { x: el.getAttribute('x1'), y: el.getAttribute('y1') },
    { x: el.getAttribute('x2'), y: el.getAttribute('y2') }
  );
};

const getPolylineLength = el => {
  const points = el.points;
  let totalLength = 0;
  let previousPos;
  for (let i = 0; i < points.numberOfItems; i++) {
    const currentPos = points.getItem(i);
    if (i > 0) {
      totalLength += getDistance(previousPos, currentPos);
    }
    previousPos = currentPos;
  }
  return totalLength;
};

const getPolygonLength = el => {
  const points = el.points;
  const distance = getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
  return getPolylineLength(el) + distance;
};

export const getSvgElLength = el => {
  switch (el.tagName.toLowerCase()) {
    case 'path':
      return el.getTotalLength();
    case 'circle':
      return getCircleLength(el);
    case 'rect':
      return getRectLength(el);
    case 'line':
      return getLineLength(el);
    case 'polyline':
      return getPolylineLength(el);
    case 'polygon':
      return getPolygonLength(el);
    default:
      return 0;
  }
};