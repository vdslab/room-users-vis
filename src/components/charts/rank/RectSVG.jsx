

export const RectSVG = (props) => {
  
  const { max, total } = props;
  
  const widthPercentage = (total / max) * 100;
  
  return (
    <svg width='100%' height='40'>
      <rect x='0' y='0' width={`calc(${widthPercentage}% - 1px)`} height='40' />
    </svg>
  )
}
