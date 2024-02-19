interface Product {
  sku: string
  title: string
  desc: string
  price: number
  currency?: string
    /** empty string means use categories image */
  image: string 
    /** eg, silver, vs individual products */  
  category?: string
}


