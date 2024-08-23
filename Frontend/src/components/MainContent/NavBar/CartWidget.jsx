import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'

import cart from './assets/shoppingcart.svg'
import { CartContext } from '../../../context/CartContext'

const CartWidget = () => {
  const { totalQuantity, fetchCartFromUser } = useContext(CartContext)

  useEffect(() => {
    fetchCartFromUser()
  }, [fetchCartFromUser])

  return (
    <Link to="/home/cart" className="relative inline-flex items-center">
      <div className="relative">
        <img src={cart} alt="cart-widget" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 right-10 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </div>
    </Link>
  )
}

export default CartWidget
