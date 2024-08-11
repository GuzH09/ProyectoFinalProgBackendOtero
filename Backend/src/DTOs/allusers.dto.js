export default class AllUsersDTO {
  constructor (userdata) {
    this.id = userdata._id
    this.first_name = userdata.first_name
    this.last_name = userdata.last_name
    this.age = userdata.age
    this.email = userdata.email
    this.role = userdata.role
    this.last_connection = userdata.last_connection
  }
}
