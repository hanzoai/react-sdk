import React from 'react'
import classnames from 'classnames'

import { makeStyles, Step, StepLabel, Stepper } from '@material-ui/core'

const DEFAULT_STEPS = ['Your Info', 'Payment Info', 'Confirm Order']

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  stepper: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

export default ({ activeStep, steps }) => {
  let s = steps
  const classes = useStyles()
  if (!s || !s.length) {
    s = DEFAULT_STEPS
  }

  return (
    <div className={classnames(classes.root, 'steps')}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
      >
      {s.map((label) => (
        <Step key={label} className='step'>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
      </Stepper>
    </div>
  )
}