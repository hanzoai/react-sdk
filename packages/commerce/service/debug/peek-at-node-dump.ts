import type { CategoryNode, CategoryNodeRole, Family } from '../../types'

export default (result : {
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