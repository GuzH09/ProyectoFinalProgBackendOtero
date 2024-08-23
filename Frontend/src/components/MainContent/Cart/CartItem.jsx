import { useContext } from 'react'
import { CartContext } from '../../../context/CartContext'

const CartItem = ({ product, quantity }) => {
  const { handleOnRemove } = useContext(CartContext)

  return (
    <article className="flex flex-col w-full rounded bg-blue-50 p-4 my-2 text-sm font-medium text-blue-700 ring-1 ring-blue-600 xl:flex-row xl:justify-between xl:gap-3 xl:items-center">
      <div className="flex items-center flex-shrink-0 mb-4">
        <picture className="h-20 w-20 mr-4">
          <img
            className="h-full w-full object-contain rounded"
            src={product.thumbnails[0]}
            alt={product.title}
          />
        </picture>
        <div className="flex-grow">
          <h2 className="font-bold text-lg mb-2">{product.title}</h2>
          <p className="mb-1">Cantidad: {quantity}</p>
          <p className="mb-1">Precio x Unidad:
            <span className="font-bold text-blue-800 ml-1">${product.price}</span>
          </p>
          <p>Subtotal:
            <span className="font-bold text-blue-800 ml-1">${product.price * quantity}</span>
          </p>
        </div>
      </div>
      <button
        className="w-full rounded bg-blue-100 py-2 px-4 text-sm font-medium text-blue-700 ring-1 ring-blue-600 hover:bg-blue-200 transition-colors"
        onClick={() => handleOnRemove(product._id)}
      >
        Quitar elemento
      </button>
    </article>
  )
}

export default CartItem
