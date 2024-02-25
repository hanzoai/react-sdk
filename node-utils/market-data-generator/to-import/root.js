import AU_B from './AU-B'
import AG_B from './AG-B'

export default {
  t: 'LXB',
  label: 'Lux Bullion',
  titleToken: '',
  ch: [
    {
      t: 'AU',
      titleToken: 'Lux Gold',
      label: 'Lux Gold',
      img: 'AU_B',
      desc: "Forge your connection to the real world with Lux Gold, crafted with excellence in Dubai.",
      ch: [
        {
          t: 'B',
          label: 'Minted Bar',
          ch: AU_B
        },
        {
          t: 'C',
          label: 'Minted Coin',
          ch: [
            {
              t: '1-OZ',
              price: 1938,
              img: 'AU_C'
            }
          ]
        },
        {
          t: 'MB',
          label: 'Multibar',
          img: 'AU_MB',
          ch: [
            {
              t: '100x1-G',
              price: 6221.39
            }
          ]
        },
        {
          t: 'GD',
          label: 'Good Del. Bar',
          ch: [
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
      titleToken: 'Lux Silver',
      label: 'Lux Silver',
      ch: [
        {
          t: 'B',
          label: 'Minted Bar',
          ch: AG_B
        }, 
        {
          t: 'C',
          label: 'Minted Coin',
          ch: [
            {
              t: '1-OZ',
              price: 23.04,
              img: 'AG_C',
            }
          ]
        },
        {
          t: 'MB',
          label: 'Multibar',
          img: 'AG_MB',
          ch: [
            {
              t: '100x1-G',
              price: 74.15,
            }
          ]
        },
        {
          t: 'GD',
          label: 'Good Del. Bar',
          ch: [
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