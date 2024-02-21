import AU_B from './AU-B'
import AG_B from './AG-B'

export default {
  t: 'LUX',
  label: 'Lux Bullion',
  titleToken: '',
  sub: [
    {
      t: 'AU',
      titleToken: 'Lux Gold Bullion',
      label: 'Lux Gold Bullion',
      img: 'AU_B',
      desc: "Forge your connection to the real world with Lux Gold, crafted with excellence in Dubai.",
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
              price: 1938,
              img: 'AU_C'
            }
          ]
        },
        {
          t: 'MB',
          label: 'Minted Multibar',
          img: 'AU_MB',
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
      img: 'AG_B',
      desc: 'Get unprecedented access to silver with 1:1 asset-backed Lux Silver NFTs, sovereign ownership of physical silver without management fees, and mine-direct discount pricing.',
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
              price: 23.04,
              img: 'AG_C',
            }
          ]
        },
        {
          t: 'MB',
          label: 'Minted Multibar',
          img: 'AG_MB',
          sub: [
            {
              t: '100x1-G',
              price: 74.15,
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