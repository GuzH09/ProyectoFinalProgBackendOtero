import ItemCount from './ItemCount'
import '../SpinnerLoader/SpinnerLoader.css'

const ItemDetail = ({
  _id,
  title,
  thumbnails,
  category,
  description,
  price,
  stock
}) => {
  return (
    <article className="items-center flex flex-col">
      <picture className="w-full lg:h-72 lg:w-42 lg:p-3">
        <img className="h-full" src={thumbnails} alt={title} />
      </picture>

      <div className='flex flex-col gap-3 w-full pt-2 px-2'>
        <h2 className="font-bold text-center">{title}</h2>
        <p className='font-thin text-md'>{description}</p>
        <p className='font-bold text-lg'>$ {price}</p>
      </div>

      <div className="py-3">
        <ItemCount initial={1} stock={stock} id={_id} title={title} />
      </div>

    </article>
  )
}

export default ItemDetail
