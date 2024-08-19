import { Link } from 'react-router-dom'
// import useProductImage from "../../hooks/useProductImage";

const Item = ({ id, title, thumbnails, price, stock }) => {
  // const { imgURL, loadingItem } = useProductImage(img, false);

  return (
    <article className="w-4/5 p-1 sm:w-1/2 lg:w-1/3 xl:w-1/4">
      <div className='items-center py-1 flex flex-col border-1 rounded-md'>
        <picture className="py-1 w-56 sm:w-48 lg:w-52 xl:w-5/6">
          <img
            className="h-full w-full object-contain overflow-hidden rounded-lg"
            src={thumbnails[0]}
            alt={title}
          />
        </picture>

        <div className='w-full'>
          <h2 className="text-center text-md font-thin lg:font-medium lg:py-2">{title}</h2>
          {/* {stock > 0 ? <p>Stock disponible: {stock}</p> : <p>No hay stock.</p>} */}
          <p className='font-bold text-md text-left px-3 pt-4'>$ {price}</p>
        </div>

        <div className="py-3 w-full flex items-center justify-center">
          {stock > 0
            ? (
            <Link
              className="w-2/3 rounded text-center bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600"
              to={`/home/item/${id}`}
            >
              Ver Detalle
            </Link>
              )
            : (
            <button
              className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600"
              disabled={true}
            >
              No hay Stock
            </button>
              )}
        </div>
      </div>
    </article>
  )
}

export default Item
