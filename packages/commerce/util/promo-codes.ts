'use server'

const PROMO_CODES: {[key: string]: number} = {
  '10OFF': 10,
  '20OFF': 20,
}

const getCodeDiscount = async (code: string) => {
  if (!PROMO_CODES[code]) {
    return null
  }
  return PROMO_CODES[code]
}

export {
  getCodeDiscount as default
}