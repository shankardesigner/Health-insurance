import React from 'react';
import { styled } from '@material-ui/styles';
import { Tooltip, tooltipClasses } from '@material-ui/core';


export const BootstrapTooltip = styled(({ ...props }) => (
  <Tooltip {...props} arrow classes={{ tooltip: 'bootstrap-tooltip' }} />
))(({ theme }) => ({
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.common.black,
  },
  [`& .MuiTooltip-popper`]: {
    backgroundColor: theme.palette.common.black,
  },
}));