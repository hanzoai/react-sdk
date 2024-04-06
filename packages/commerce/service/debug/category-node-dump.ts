import type { CategoryNode } from '../../types'

  // Note recursion
const dumpNode = (node: CategoryNode, level: number = 0): void => {
  const spacers: string[] = []
  for (let i = 0; i < level; i++) {
    spacers.push('----')
  }
  console.log("NODE:" + spacers.join(''), node.skuToken)
  node.subNodes?.forEach((sn) => {dumpNode(sn, level + 1)})
}

export default dumpNode