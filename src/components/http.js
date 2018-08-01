import axios from 'axios'
import qs from 'query-string'

class UserManager {
  constructor() {
    this.$http = axios.create({
      baseURL: 'http://192.168.1.107:8182/'
    })
    this.dataMethodDefaults = {
      headers: {
        'Content-Type': 'application/json'
      },
      transfromRequest: [function (data) {
        return qs.stringify(data)
      }]
    }

  }
}

export default new UserManager

