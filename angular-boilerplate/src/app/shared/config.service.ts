import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable()
export class ConfigService {

  configFile = "assets/app.config.json";
  config
  
  constructor(private http: HttpClient) { 
    this.http.get(this.configFile).subscribe( result => this.config = result);
  }

  // Gets the app configuration from the config.json file
  getConfiguration() {
    return this.config;
  }
}
