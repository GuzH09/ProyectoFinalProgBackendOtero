import { useEffect, useState, useContext, useRef } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import io from 'socket.io-client'
import { useNotification } from '../../../context/Notification'
import '../SpinnerLoader/SpinnerLoader.css'

const AdminManager = () => {
  const { profile } = useContext(AuthContext)
  const { setNotification } = useNotification()
  const [products, setProducts] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')

  const [editProductId, setEditProductId] = useState(null)
  const [editedProduct, setEditedProduct] = useState({})

  const [category, setCategory] = useState('')
  const socketRef = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('https://proyectofinalprogbackendotero.onrender.com', {
      withCredentials: true,
      reconnectionAttempts: 5, // Limit the number of reconnection attempts
      timeout: 10000 // Set timeout for the connection
    })

    // Emit user connection event
    if (profile) {
      setLoading(true)
      socketRef.current.emit('productsConnect', profile)
    }

    // Receive messages from server
    socketRef.current.on('refreshProducts', (data) => {
      setProducts(data)
      setLoading(false)
    })

    // Listen for new user notification
    socketRef.current.on('statusError', (data) => {
      setNotification('danger', JSON.stringify(data))
      console.log(data)
    })

    // Handle connection errors
    socketRef.current.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })

    socketRef.current.on('connect_timeout', () => {
      console.error('Connection timeout')
    })

    socketRef.current.on('reconnect_attempt', (attempt) => {
      console.log('Reconnection attempt:', attempt)
    })

    socketRef.current.on('reconnect_failed', () => {
      console.error('Reconnection failed')
    })

    // Clean up socket connection on component unmount
    return () => {
      socketRef.current.disconnect()
    }
  }, [profile])

  const addProduct = () => {
    if (socketRef.current && profile) {
      const product = {
        title,
        description,
        code,
        price,
        stock,
        category
      }
      socketRef.current.emit('addProduct', product, profile)
      setTitle('')
      setDescription('')
      setCode('')
      setPrice('')
      setStock('')
      setCategory('')
    }
  }

  const handleEditClick = (product) => {
    setEditProductId(product._id)
    setEditedProduct({
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const confirmEdit = () => {
    if (socketRef.current && profile) {
      socketRef.current.emit('updateProduct', { ...editedProduct, _id: editProductId }, profile)
      setEditProductId(null)
    }
  }

  const cancelEdit = () => {
    setEditProductId(null)
  }

  const deleteProduct = (productId) => {
    if (socketRef.current && profile) {
      socketRef.current.emit('deleteProduct', productId, profile)
    }
  }

  return (
        <div className="flex flex-column min-h-[80vh] p-3 items-center">
            {/* Form for adding new products */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Inputs for new product */}
                <div className="flex flex-col items-center gap-1 w-1/3">
                    <label className="text-md">Nombre del Producto:</label>
                    <input
                        className="text-white font-thin rounded-md border-1 border-[#30363d] bg-[#21262d] w-3/4"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                    <label className="text-md">Descripcion del Producto:</label>
                    <input
                        className="text-white font-thin rounded-md border-1 border-[#30363d] bg-[#21262d] w-3/4"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                    <label className="text-md">Codigo:</label>
                    <input
                        className="text-white font-thin rounded-md border-1 border-[#30363d] bg-[#21262d] w-3/4"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                    <label className="text-md">Precio:</label>
                    <input
                        className="text-white font-thin rounded-md border-1 border-[#30363d] bg-[#21262d] w-3/4"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                    <label className="text-md">Stock:</label>
                    <input
                        className="text-white font-thin rounded-md border-1 border-[#30363d] bg-[#21262d] w-3/4"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                    <label className="text-md">Categoria:</label>
                    <input
                        className="text-white font-thin rounded-md border-1 border-[#30363d] bg-[#21262d] w-3/4"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <button onClick={addProduct} className="text-white rounded-md border-1 border-[#30363d] bg-[#21262d] p-1 text-sm w-1/6">Agregar Producto</button>
            </div>

            {/* List of products */}
            <div className="bg-white w-2/3 pt-4 grid grid-cols-4 gap-2">
                {loading
                  ? (
                      <div className="flex flex-row items-baseline justify-center pt-4 bg-white min-h-[50vh]">
                        <div className="loader"></div>
                      </div>
                    )
                  : (
                    <>
                    {products.map((prod) => (
                      <article key={prod._id} className="flex flex-col h-full p-1 w-full text-center rounded-md border-1 border-[#30363d] bg-[#3e4855]">
                        {/* Product being edited */}
                        {prod._id === editProductId
                          ? (
                            <>
                              <header>
                                <h2 className="font-medium py-2 text-white">
                                  <input type="text" name="title" value={editedProduct.title} onChange={handleInputChange} />
                                </h2>
                              </header>
                              <section className='py-2 flex-grow'>
                                <input type="text" name="description" value={editedProduct.description} onChange={handleInputChange} className='w-full'/>
                                <input type="text" name="code" value={editedProduct.code} onChange={handleInputChange} />
                                <input type="text" name="category" value={editedProduct.category} onChange={handleInputChange} />
                                <input type="number" name="price" value={editedProduct.price} onChange={handleInputChange} />
                                <input type="number" name="stock" value={editedProduct.stock} onChange={handleInputChange} />
                              </section>
                              <div className='flex flex-row justify-evenly gap-1 justify-self-end'>
                                <button
                                  className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600 w-1/3"
                                  onClick={confirmEdit}
                                >
                                Confirmar Modificación
                                </button>
                                <button
                                  className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600 w-1/3"
                                  onClick={cancelEdit}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </>
                            )
                          : (
                            <>
                              {/* Product not being edited */}
                              <header>
                                <h2 className="font-medium py-2 text-white">
                                  {prod.title}
                                </h2>
                              </header>
                              <section className='py-2 flex-grow'>
                                <p className='text-white'>Descripcion: {prod.description}</p>
                                <p className='text-white'>Codigo: {prod.code}</p>
                                <p className='text-white'>Categoria: {prod.category}</p>
                                <p className='text-white'>Precio: {prod.price}</p>
                                {prod.stock > 0
                                  ? <p className='text-white'>Stock disponible: {prod.stock}</p>
                                  : <p className='text-white'>No hay stock.</p>}
                              </section>
                              <div className='flex flex-row justify-evenly gap-1 justify-self-end'>
                                <button
                                    className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600 w-1/3"
                                    onClick={() => deleteProduct(prod._id)}
                                >
                                    Eliminar Producto
                                </button>
                                <button
                                    className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600 w-1/3"
                                    onClick={() => handleEditClick(prod)}
                                >
                                    Modificar Producto
                                </button>
                              </div>
                            </>
                            )}
                      </article>
                    ))}
                    </>
                    )}
            </div>
        </div>
  )
}

export default AdminManager
