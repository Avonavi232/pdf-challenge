import type { FC, ReactElement } from 'react';

import styles from './styles.module.css';

export interface ILabeledInfoProps {
    label: string
    children: ReactElement
}

export const LabeledInfo: FC<ILabeledInfoProps> = ({ label, children }) => {
    return (
      <div className={styles['container']}>
          <span className={styles['label']}>{label}</span>
          {children}
      </div>
    );
};
