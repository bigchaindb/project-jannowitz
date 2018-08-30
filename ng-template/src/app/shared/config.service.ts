import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  private static ConfigFilePath = 'assets/app.config.json';

  constructor(private http: Http) { }

  // Gets the app configuration from the config.json file
  async getConfiguration() {
    const config = await this.http.get(ConfigService.ConfigFilePath);
    return config;
  }
}
