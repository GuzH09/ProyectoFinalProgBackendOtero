import Item from './Item'

const ItemList = ({ products }) => {
  return (
    <div className="flex flex-row flex-wrap justify-evenly items-center py-3 bg-white gap-3">
      {products.map((prod) => (
        <Item key={prod.id} {...prod} />
      ))}
    </div>
  )
}

export default ItemList
