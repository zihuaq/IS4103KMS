import { Platform } from "@Ionic/angular"
import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { Storage } from "@ionic/storage"
import { User } from "../classes/user"

const LOGGED_IN_USER = "loggedInUser"

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false)

  constructor(private storage: Storage, private plt: Platform) {
    this.plt.ready().then(() => {
      this.checkToken()
    })
  }

  login(user: User) {
    return this.storage
      .set(LOGGED_IN_USER, JSON.stringify(user))
      .then((res) => {
        this.authenticationState.next(true)
      })
  }

  logout() {
    return this.storage.remove(LOGGED_IN_USER).then(() => {
      this.authenticationState.next(false)
      this.authenticationState = new BehaviorSubject(false)
    })
  }

  isAuthenticated() {
    return this.storage.get(LOGGED_IN_USER).then(
      (res) => {
        console.log(res)
        if (res) {
          return true
        } else {
          return false
        }
      },
      (err) => {
        console.log(err)
        return false
      }
    )
  }

  getCurrentUser(): Promise<User> {
    return this.storage.get(LOGGED_IN_USER).then((value) => {
      return JSON.parse(value)
    })
  }

  checkToken() {
    return this.storage.get(LOGGED_IN_USER).then((res) => {
      if (res) {
        this.authenticationState.next(false)
      }
    })
  }
}
