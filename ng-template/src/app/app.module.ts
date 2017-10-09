import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MaterialModule } from './material/material.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ConfigService } from './shared/config.service'
import { LoginComponent } from './login/login.component'
import { AuthService } from './shared/auth.service'
import { BdbService } from './shared/bdb.service'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [ConfigService, AuthService, BdbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
