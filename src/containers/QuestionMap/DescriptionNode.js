import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import styles from './questionmap.module.css';

export default memo(({ data }) => {
    return (
        <>
            <Handle
                type="target"
                position="top"
                style={{ left: 100, top: 0, background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <Container className={styles.descriptionContainer}>
                <Grid container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Grid item>
                        <Grid container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            className={styles.descriptionBox}
                        >
                            <Grid item>
                                <span className={styles.descriptionBoxTitle}>Monitor for nephrologic cause</span>
                            </Grid>
                            <Grid item>
                                <span className={styles.descriptionBoxText}>
                                    Annually with urine dipstick, BP, eGFR and ACR/PCR while haematuria persists

                                    Refer to nephrology if any of:
                                    <ul className={styles.listStyle}>
                                        <li>eGFR &lt; 30 mL/min/1.73m2</li>
                                        <li>eGFR &lt; 45 mL/min/1.73m2</li>
                                    </ul>
                                    if person has diabetes
                                    <ul className={styles.listStyle}>
                                        <li>eGFR declining by &gt; 10 mL/min at any stage in last five years, or &gt; 5 mL/min in last year</li>
                                        <li>Proteinuria ACR &ge; 30 mg/mmol or PCR ≥ 50 mg/mmol</li>
                                        <li>Uncontrolled blood pressure(140/90 mmHg)</li>
                                    </ul>
                                </span>
                            </Grid>
                        </Grid>


                    </Grid>
                    <Grid item>
                        <Grid container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            className={styles.descriptionBox}
                        >
                            <Grid item>
                                <span className={styles.descriptionBoxTitle}>Monitor for urologic cause</span>
                            </Grid>
                            <Grid item>
                                <span className={styles.descriptionBoxText}>
                                    Monitor for urologic cause
                                    Annually, for two years, with urine dipstick, eGFR, ACR/PCR and cytology.

                                    Refer to urology if any of:
                                    <ul className={styles.listStyle}>
                                        <li>Haematuria persists</li>
                                        <li>Urine cytology positive</li>
                                        <li>Urinary tract symptoms develop or increase</li>
                                    </ul>
                                </span>
                            </Grid>
                            <Grid item>
                                <span className={styles.descriptionBoxTitle}>Monitor in Primary Care</span>
                            </Grid>
                        </Grid>


                    </Grid>
                </Grid>
            </Container>
            <Handle
                type="target"
                position="top"
                id="descTop"
                style={{ left: 300, top: 1, background: '#555' }}
            />
            
        </>
    );
});