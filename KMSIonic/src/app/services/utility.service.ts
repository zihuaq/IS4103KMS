import { Platform } from "@ionic/angular"
import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root"
})
export class UtilityService {
  constructor(private platform: Platform) {}

  getRootPath(): string {
    console.log('this.platform.is("hybrid"): ' + this.platform.is("hybrid"))

    if (this.platform.is("hybrid")) {
      return "192.168.1.212:8080/KMS-war/Resources/" //change this to your local machine ip
    } else {
      return "/api/"
    }
  }
}
