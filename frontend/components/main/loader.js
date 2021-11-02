import { SpinnerCircular } from 'spinners-react';

/**Loader .. pass in white/orange prop if you want a different circle
 * 
 * Default (neither white/orange) - black circle
 * 
*/
export default function Loader({white = false,  orange = false, size = 30}) {
  let fgColor="rgba(0, 0, 0, 1)"
  let bgColor="rgba(255,255,255,0)"
  if(white){
    fgColor="rgba(255, 255, 255, 1)"
    bgColor="rgba(255, 255, 255, 0)"
  }
  if(orange){
    fgColor="rgba(255, 152, 0, 1)"
    bgColor="rgba(255, 255, 255, 0)"
  }
  


  return (
    <SpinnerCircular 
      size={size} 
      thickness={180} 
      speed={99} 
      color={fgColor} 
      secondaryColor={bgColor} 
    />
  )
}