import { ComponentProps, FC } from 'react';
import cn from 'classnames';

import styles from './styles.module.css'

export interface IIconButtonProps extends ComponentProps<'button'>{
    icon: string
}

export const IconButton: FC<IIconButtonProps> = ({ icon, className, ...buttonProps }) => {
    return (
      <button {...buttonProps} className={cn(className, styles['button'])}>
          <img src={icon} alt="icon"/>
      </button>
    );
};
