import React from 'react';
import { FormControlLabel, FormGroup, styled, Switch } from '@material-ui/core';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 54,
  height: 24,
  padding: 0,
  border: `1px solid #DCDCDC`,
  boxShadow: `0 1px 8px rgba(61, 62, 100, 0.1)`,
  borderRadius: 50,

  '& .MuiSwitch-switchBase': {
    padding: 0,
    transitionDuration: '200ms',
    margin: 1,

    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: '#fff',

      '& + .MuiSwitch-track': {
        backgroundColor: '#FFF',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },

      '& .MuiSwitch-thumb': {
        backgroundColor: '#64B6F5',
      }
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: '#FFF',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    width: 24,
    height: 18,
    background: '#B9BABA',
    borderRadius: 50,
    boxShadow: 'none',
    margin: `1px 2px`,
  },
  '& .MuiSwitch-track': {
    background: '#FFF',
  },
}));

const NemoSwitch = ({label, ...props}) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<IOSSwitch {...props} />}
        label={label || ''}
      />
    </FormGroup>
  )
}

export default NemoSwitch