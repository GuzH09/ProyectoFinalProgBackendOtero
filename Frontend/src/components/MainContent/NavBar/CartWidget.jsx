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
    <Link to="/home/cart">
      <div className="lg:flex lg:flex-row lg:items-center lg:justify-end">
        { totalQuantity > 0 &&
        <div>
            <span className="h-5 w-5 absolute top-15 right-10 bg-white rounded-full"></span>
            <p className="font-bold absolute top-15 right-11 text-[#21232A] text-sm">{totalQuantity}</p>
        </div>
        }
        <img src={cart} alt="cart-widget" />
      </div>
    </Link>
  )
}

export default CartWidget
