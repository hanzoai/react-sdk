import type { CategoryNode,  CategoryNodeRole, Family } from '../types'

  // Note recursion
export const categoryNodeDump = (node: CategoryNode, level: number = 0): void => {
  const spacers: string[] = []
  for (let i = 0; i < level; i++) {
    spacers.push('----')
  }
  console.log("NODE:" + spacers.join(''), node.skuToken)
  node.subNodes?.forEach((sn: CategoryNode) => {categoryNodeDump(sn, level + 1)})
}
 
export const selectedFamiliesDump = (result: Family[]) => {
  console.log('SELECTED FAMS: ', (result.map((c) => (c.id)))) 
}

export const peekAtNodeDump = (result : {
    role: CategoryNodeRole
    family: Family | undefined
    families: Family[] | undefined
    node: CategoryNode | undefined
}) => {
  const toDisplay = {
    role: result.role,
    family: result.family ? result.family.id : 'UNDEF',
    families: result.families ? result.families.map((f) => (f.id)) : 'UNDEF',
    node: result.node ? (result.node.skuToken + ': ' + result.node.label) : 'UNDEF'
  }
  console.log(toDisplay)
}