import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import styles from './questionmap.module.css';

export default memo(({ data }) => {
    return (
        <>
            <Handle
                type="target"
                position="top"
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <div className={styles.textPadding}>
                {data.label}
            </div>
            <Handle
                type="target"
                position="left"
                id={data.idLeft}
            />
            <Handle
                type="source"
                position="right"
                id={data.idRight}
            />
            <Handle
                type="source"
                position="bottom"
                id={data.idBottom}
            />
        </>
    );
});