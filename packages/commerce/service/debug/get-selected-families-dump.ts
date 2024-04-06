  
import type { Family } from '../../types'

export default (result: Family[]) => {
  console.log('SELECTED FAMS: ', (result.map((c) => (c.id)))) 
}
