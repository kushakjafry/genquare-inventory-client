//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  AuthInterceptor,
  UnauthorizedInterceptor,
} from './services/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

//components
import { AppComponent } from './app.component';
import { BooksTableComponent } from './books-table/books-table.component';
import { BookListComponent } from './book-list/book-list.component';
import { LoginComponent } from './login/login.component';

// services
import { BookService } from './services/book.service';
import { AuthService } from './services/auth.service';
import { ProcessHttpErrorMsgService } from './services/process-http-error-msg.service';
import { SnackbarService } from './services/snackbar.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BooksTableComponent,
    BookListComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    BookService,
    AuthService,
    ProcessHttpErrorMsgService,
    SnackbarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
