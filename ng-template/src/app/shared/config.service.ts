import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { Config } from '../models/config.model'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class ConfigService {

  private static ConfigFilePath = 'assets/app.config.json'

  constructor(private http: Http) { }

  // Gets the app configuration from the config.json file
  async getConfiguration() {
    const config = await this.http.get(ConfigService.ConfigFilePath).toPromise()
    return config.json()
  }
}
