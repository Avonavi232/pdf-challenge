import { FC } from 'react';
import cn from 'classnames';

import styles from './styles.module.css';

export interface IInfoTextProps {
    className?: string;
    children: string;
}

export const InfoText: FC<IInfoTextProps> = ({ className, children }) => {
    return (
      <div className={cn(className, styles['container'])}>
          {children}
      </div>
    );
};
