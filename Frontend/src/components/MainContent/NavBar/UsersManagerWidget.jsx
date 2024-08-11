import admin from './assets/admin.svg'
import { Link } from 'react-router-dom'

const UsersWidget = () => {
  return (
    <Link to="/home/usersmanager">
        <img className="h-7 w-7" src={admin} alt="admin-widget" />
    </Link>
  )
}

export default UsersWidget
