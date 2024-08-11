import { useEffect, useState, useContext, useRef, useCallback } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useNotification } from '../../../context/Notification'

const UsersManager = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { setNotification } = useNotification()
  const [editUserId, setEditUserId] = useState(null)
  const [editedRoleUser, setEditedRoleUser] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://proyectofinalprogbackendotero.onrender.com/api/users', {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setUsers(data.payload)
        console.log(data.payload)
      } catch (error) {
        setNotification('danger', 'No es posible cargar los productos')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [setUsers, setNotification])

  const handleEditClick = (user) => {
    setEditUserId(user.id)
    setEditedRoleUser(user.role)
  }

  const confirmEdit = async () => {
    try {
      await fetch(`https://proyectofinalprogbackendotero.onrender.com/api/users/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: editedRoleUser }),
        credentials: 'include'
      })
    } catch (error) {
      console.error(error)
    }
    setEditUserId(null)
    setEditedRoleUser('')
    setUsers(prevUsers => prevUsers.map(user => user.id === editUserId ? { ...user, role: editedRoleUser } : user))
  }

  const cancelEdit = () => {
    setEditUserId(null)
  }

  const deleteUser = async (uid) => {
    try {
      await fetch(`https://proyectofinalprogbackendotero.onrender.com/api/users/${uid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
        <div className="flex flex-column min-h-[80vh] p-3 items-center">
            {/* List of products */}
            <div className="bg-white w-2/3 pt-4 grid grid-cols-4 gap-2">
                {users.map((user) => (
                    <article key={user.id} className="flex flex-col h-full p-1 w-full text-center rounded-md border-1 border-[#30363d] bg-[#3e4855]">
                      <header>
                        <h2 className="font-medium py-2 text-white">
                          {user.first_name + ' ' + user.last_name}
                        </h2>
                      </header>
                      <section className='py-2 flex-grow'>
                        <p className='text-white'>Edad: {user.age}</p>

                        <p className='text-white'>Email: {user.email}</p>

                        {user.id === editUserId
                          ? <input type="text" name="role" value={editedRoleUser} onChange={(e) => setEditedRoleUser(e.target.value)} />
                          : <p className='text-white'>Rol: {user.role}</p>}

                        <p className='text-white'>Ultima Conexion: {user.last_connection}</p>
                      </section>
                      <div className='flex flex-row justify-evenly gap-1 justify-self-end'>
                      {user.id === editUserId
                        ? <>
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
                          </>
                        : <>
                          <button
                          className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600 w-1/3"
                          onClick={() => deleteUser(user.id)}
                          >
                            Eliminar Usuario
                          </button>
                          <button
                            className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600 w-1/3"
                            onClick={() => handleEditClick(user)}
                          >
                            Modificar Usuario
                          </button>
                          </>}
                      </div>
                    </article>
                ))}
            </div>
        </div>
  )
}

export default UsersManager
