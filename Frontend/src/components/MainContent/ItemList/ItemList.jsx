import Item from './Item'

const ItemList = ({ products }) => {
  return (
    <div className="flex flex-col items-center py-3 bg-white sm:flex-row sm:flex-wrap sm:justify-evenly xl:justify-start xl:px-3">
      {products.map((prod) => (
        <Item key={prod.id} {...prod} />
      ))}
    </div>
  )
}

export default ItemList
