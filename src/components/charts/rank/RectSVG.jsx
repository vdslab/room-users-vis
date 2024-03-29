export const RectSVG = (props) => {
  const { max, total, color, marginW } = props;

  const widthPercentage = (total / max) * 100;

  return (
    <svg width={`calc(${widthPercentage}% - ${marginW}px)`} height="40">
      <rect x="0" y="0" width="100%" height="40" fill={color} />
    </svg>
  );
};
