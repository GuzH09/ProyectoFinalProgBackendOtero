import { useEffect, useState } from 'react'
import '../SpinnerLoader/SpinnerLoader.css'
import ItemDetail from './ItemDetail'
import { useParams } from 'react-router-dom'

const ItemDetailContainer = () => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const { itemId } = useParams()

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        setLoading(true)

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${itemId}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        // Process the data to include full URLs for thumbnails
        const baseURL = `${import.meta.env.VITE_BACKEND_URL}/static/img/`
        const processedProduct = {
          ...data,
          thumbnails: data.thumbnails.map(
            (thumbnail) => baseURL + thumbnail.split('public\\img\\')[1]
          )
        }

        setProduct(processedProduct)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProductById()
  }, [itemId])

  if (loading) {
    return (
      // <div className="flex flex-row justify-center pt-5 pb-[48%]">
      //   <div className="loader"></div>
      // </div>
      <div className="flex flex-row items-baseline justify-center pt-5 bg-white min-h-[50vh]">
          <div className="loader"></div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[82vh] lg:pt-4 lg:px-12 lg:min-h-[81vh]">
        <ItemDetail {...product} />
      </div>
    </>
  )
}

export default ItemDetailContainer
