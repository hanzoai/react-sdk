import { Icons } from '../common'
import type { LinkDef } from '../types'

const SOC_ICON_SIZE = 18

export default [
  [
    {
      title: 'Market',
      href: "https://app.lux.market/",
      external: true,
      newTab: false,
      variant: 'linkFG'
    },
    {
      title: 'Lux Silver',
      href: '/silver',
    },
    {
      title: 'Lux Gold',
      href: '/gold',
    },
    {
      title: 'Lux Coin',
      href: '/coin',
    },
    /*{
      title: 'Lux Uranium',
      href: '/uranium',
    }*/,
    {
      title: 'Lux Credit',
      href: '/credit',
    },
    {
      title: 'Lux Validator',
      href: '/validator',
    },
    {
      title: 'Lux Pass',
      href: '/pass',
    },
  ],
  [
    {
      title: 'Network',
      href: "https://lux.network/",
      variant: 'linkFG'
    },
    {
      title: 'Apply for Beta',
      href: 'https://apply.lux.network/',
      external: true,
      newTab: false
    },
    {
      title: 'Whitepapers',
      href: 'https://docs.lux.network/intro/about',
    },
    {
      title: 'Github',
      href: 'https://github.com/luxdefi',
    },
  ],
  [
    {
      title: 'Partners',
      href: "https://lux.partners/",
      variant: 'linkFG',
      external: true
    },
    {
      title: 'About',
      href: 'https://lux.partners',
      external: true,
      newTab: false,
    },
    {
      title: 'Partner with Lux',
      href: 'https://apply.lux.partners/',
      external: true
    },
    {
      title: 'Lux Fund',
      href: 'https://lux.fund',
      newTab: false,
      external: true
    },
    {
      title: 'Lux Support',
      href: 'mailto:support@lux.partners?subject=%E2%96%BC%20Lux%20Support',
      external: true
    },
    {
      title: 'Careers',
      href: 'https://docs.lux.network/about/v/lux-job-listings/',
      newTab: false,
      external: true
    },
    {
      title: 'Press Kit',
      href: 'https://drive.google.com/drive/folders/14OJtKLVakGY6883XO9yGbiHtlFxQUUm5?usp=share_link',
      external: true
    },
  ],  
  [
    {
      title: 'Community',
      variant: 'linkFG',
    },
    {
      title: 'Discord',
      href: 'https://discord.gg/luxdefi',
      external: true,
      icon: <Icons.SocialIcon network='discord' size={SOC_ICON_SIZE} />
    },
    {
      title: 'Telegram',
      href: 'https://t.me/luxdefi',
      external: true,
      icon: <Icons.SocialIcon network='telegram' size={SOC_ICON_SIZE} />
    },
    {
      title: 'X (Twitter)',
      href: 'https://twitter.com/luxdefi',
      external: true,
      icon: <Icons.SocialIcon network='x' size={SOC_ICON_SIZE} />
    },
    {
      title: 'Facebook',
      href: 'https://facebook.com/luxdefi',
      external: true,
      icon: <Icons.SocialIcon network='facebook' size={SOC_ICON_SIZE + 2} />
    },
    {
      title: 'LinkedIn',
      href: 'https://linkedin.com/company/luxdefi',
      external: true,
      icon: <Icons.SocialIcon network='linkedin' size={SOC_ICON_SIZE + 2} />
    },
    {
      title: 'Instagram',
      href: 'https://instagram.com/luxdefi',
      external: true,
      icon: <Icons.SocialIcon network='instagram' size={SOC_ICON_SIZE + 2} />
    },
  ],
  [
    {
      title: 'Legal',
      variant: 'linkFG',
    },
    {
      title: 'Terms and Conditions',
      href: '/assets/standard-docs/LUX-NFT-Terms-and-Conditions.pdf',
      newTab: true,
    },
    {
      title: 'Privacy Policy',
      href: '/assets/standard-docs/LUX-Privacy-Policy.pdf',
      newTab: true,
    },
  ],
] as LinkDef[][]