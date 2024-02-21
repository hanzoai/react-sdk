import AU_B from './AU-B'
import AG_B from './AG-B'

export default {
  t: 'LUX',
  label: 'Lux Bullion',
  sub: [{
    t: 'AU',
    label: 'Lux Gold',
    img: 'assets/img/cart/bar-gold-1072x1072.png',
    labelLong: 'Lux Gold Bullion',
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
  }], 
  sub: [{
    t: 'AG',
    img: 'assets/img/cart/bar-silver-1072x1072.png',
    label: 'Lux Silver',
    labelLong: 'Lux Silver Bullion',
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
  }] 
}