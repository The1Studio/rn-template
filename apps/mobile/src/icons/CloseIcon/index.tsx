import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

interface ICloseIconProps {
  size?: number;
  color?: string;
}
const CloseIcon = ({size, color}: ICloseIconProps) => (
  <Svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color || '#DEE2E6'}
      d="M16.976 17.825a.603.603 0 0 0 .849 0 .603.603 0 0 0 0-.848L12.848 12l4.977-4.977a.603.603 0 0 0 0-.848.603.603 0 0 0-.849 0L12 11.15 7.026 6.175a.603.603 0 0 0-.85 0 .603.603 0 0 0 0 .848L11.152 12l-4.977 4.977a.603.603 0 0 0 0 .848.603.603 0 0 0 .849 0l4.976-4.976 4.977 4.976Z"
      opacity={0.8}
    />
  </Svg>
);
export default CloseIcon;
