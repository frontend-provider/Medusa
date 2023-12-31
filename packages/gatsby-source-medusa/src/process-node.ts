export const processNode = (
  node: any,
  fieldName: string,
  createContentDigest: (this: void, input: string | object) => string
): any[] => {
  const nodeId: string = node.id
  const nodeContent = JSON.stringify(node)
  const nodeContentDigest = createContentDigest(nodeContent)

  let images = []

  if (fieldName === "products") {
    if (node.images?.length) {
      images = node.images.map((image: any) => {
        const nodeImageContentDigest = createContentDigest(image.id)
        const nodeImageContent = JSON.stringify(image)

        const imageData = Object.assign({}, image, {
          id: image.id,
          parent: nodeId,
          children: [],
          internal: {
            type: "MedusaImages",
            content: nodeImageContent,
            contentDigest: nodeImageContentDigest,
          },
        })

        return imageData
      })
    }
    delete node.images
  }

  // TODO: use upperFirstCase from medusajs/utils when it's available
  const type = `Medusa${fieldName[0].toUpperCase() + fieldName.slice(1)}`
  const nodeData = Object.assign({}, node, {
    id: nodeId,
    parent: null,
    children: [],
    internal: {
      type,
      content: nodeContent,
      contentDigest: nodeContentDigest,
    },
  })

  return [nodeData, ...images]
}
