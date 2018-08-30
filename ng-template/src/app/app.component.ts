import { Component } from '@angular/core';
import { ConfigService } from './shared/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private configService: ConfigService) { }

  // load configuration on init
  OnInit(): void {
    this.configService.getConfiguration().then(config => {
      localStorage.setItem('config', JSON.stringify(config));
    });
  }
}
