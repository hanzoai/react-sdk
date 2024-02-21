import AU_B from './AU-B'
import AG_B from './AG-B'

export default {
  t: 'LUX',
  label: 'Lux Bullion',
  titleToken: '',
  chn: [
    {
      t: 'AU',
      titleToken: 'Lux Gold Bullion',
      label: 'Lux Gold Bullion',
      img: 'AU_B',
      desc: "Forge your connection to the real world with Lux Gold, crafted with excellence in Dubai.",
      chn: [
        {
          t: 'B',
          label: 'Minted Bar',
          chn: AU_B
        },
        {
          t: 'C',
          label: 'Coin',
          chn: [
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
          chn: [
            {
              t: '100x1-G',
              price: 6221.39
            }
          ]
        },
        {
          t: 'GD',
          label: 'Good Delivery Bar',
          chn: [
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
      chn: [
        {
          t: 'B',
          label: 'Minted Bar',
          chn: AG_B
        }, 
        {
          t: 'C',
          label: 'Coin',
          chn: [
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
          chn: [
            {
              t: '100x1-G',
              price: 74.15,
            }
          ]
        },
        {
          t: 'GD',
          label: 'Good Delivery Bar',
          chn: [
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