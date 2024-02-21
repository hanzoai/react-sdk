import AU_B from './AU-B.js'
import AG_B from './AG-B.js'

export default {
  t: 'LUX',
  label: 'Lux Bullion',
  titleToken: '',
  sub: [
    {
      t: 'AU',
      titleToken: 'Lux Gold Bullion',
      label: 'Lux Gold Bullion',
      img: 'assets/img/cart/bar-gold-1072x1072.png',
      desc: 'gold desc',
      sub: [
        {
          t: 'B',
          label: 'Minted Bar',
          sub: AU_B
        },
        {
          t: 'C',
          label: 'Coin',
          sub: [
            {
              t: '1-OZ',
              price: 1938
            }
          ]
        },
        {
          t: 'MB',
          label: 'Minted Multibar',
          sub: [
            {
              t: '100x1-G',
              price: 6221.39
            }
          ]
        },
        {
          t: 'GD',
          label: 'Good Delivery Bar',
          sub: [
            {
              t: '400-OZ',
              price: 800000
            }
          ]
        }
      ]
    },
    {
      t: 'AG',
      img: 'assets/img/cart/bar-silver-1072x1072.png',
      desc: 'silver desc',
      titleToken: 'Lux Silver Bullion',
      label: 'Lux Silver Bullion',
      sub: [
        {
          t: 'B',
          label: 'Minted Bar',
          sub: AG_B
        }, 
        {
          t: 'C',
          label: 'Coin',
          sub: [
            {
              t: '1-OZ',
              price: 23.04
            }
          ]
        },
        {
          t: 'MB',
          label: 'Minted Multibar',
          sub: [
            {
              t: '100x1-G',
              price: 74.15
            }
          ]
        },
        {
          t: 'GD',
          label: 'Good Delivery Bar',
          sub: [
            {
              t: '1000-OZ',
              price: 22000
            }
          ]
        }
      ]
    }
  ], 
}