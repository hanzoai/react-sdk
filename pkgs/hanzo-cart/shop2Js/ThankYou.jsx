import React from 'react'

import { Box, Grid, Typography } from '@material-ui/core'

export default ({ order, isDonation }) => (
  <Box p={[2, 3, 4]} className='thank-you'>
    <Grid container>
      <Grid item xs={12}>
        <Typography variant='h5'>Thank you for your {(isDonation) ? 'contribution' : 'purchase'}.</Typography>
        <br />
        <Typography>
          {order && order.number && (<>
            <>Your order confirmation number is <strong>{order.number}</strong>.</>
            <br />
          </>)}
          You will also receive an email confirmation{(isDonation) ? '.' : ' as well shipping related updates.'}
        </Typography>
      </Grid>
    </Grid>
  </Box>
)
