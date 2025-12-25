import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

interface IInfoIconProps {
  size?: number;
  color?: string;
}
const InfoIcon = ({size, color}: IInfoIconProps) => (
  <Svg width={size || 18} height={size || 18} viewBox="0 0 18 18" fill="none">
    <Path
      fill={color || '#fff'}
      d="M9 2.5c-2.344 0-4.469 1.25-5.656 3.25a6.524 6.524 0 0 0 0 6.5A6.507 6.507 0 0 0 9 15.5c2.313 0 4.438-1.219 5.625-3.25a6.524 6.524 0 0 0 0-6.5C13.437 3.75 11.312 2.5 9 2.5ZM9 17c-2.875 0-5.5-1.5-6.938-4-1.437-2.469-1.437-5.5 0-8A8.018 8.018 0 0 1 9 1c2.844 0 5.469 1.531 6.906 4 1.438 2.5 1.438 5.531 0 8A7.94 7.94 0 0 1 9 17ZM9 5a.76.76 0 0 1 .75.75v3.5A.74.74 0 0 1 9 10a.722.722 0 0 1-.75-.75v-3.5A.74.74 0 0 1 9 5Zm1 7c0 .563-.469 1-1 1-.563 0-1-.438-1-1 0-.531.438-1 1-1 .531 0 1 .469 1 1Z"
    />
  </Svg>
);
export default InfoIcon;
