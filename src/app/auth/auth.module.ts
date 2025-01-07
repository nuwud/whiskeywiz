import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { RegisterComponent } from './register/register.component';
import { ShopifyCallbackComponent } from './shopify-callback/shopify-callback.component';

@NgModule({
  declarations: [
    LoginComponent,
    AuthButtonComponent,
    RegisterComponent,
    ShopifyCallbackComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    LoginComponent,
    AuthButtonComponent,
    RegisterComponent,
    ShopifyCallbackComponent
  ]
})
export class AuthModule { }