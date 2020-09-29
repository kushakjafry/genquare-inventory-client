//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

//components
import { AppComponent } from './app.component';
import { BookListComponent } from './book-list/book-list.component';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { BarcodeScanComponent } from './barcode-scan/barcode-scan.component';
import { TableComponent } from './table/table.component';
import { AddBookComponent } from './add-book/add-book.component';
import { FileUploadBooksComponent } from './file-upload-books/file-upload-books.component';
import { AutofocusDirective } from './directives/autofocus.directive';

// services
import { BookService } from './services/book.service';
import { AuthService } from './services/auth.service';
import { ProcessHttpErrorMsgService } from './services/process-http-error-msg.service';
import { SnackbarService } from './services/snackbar.service';
import {
  AuthInterceptor,
  UnauthorizedInterceptor,
} from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BookListComponent,
    LoginComponent,
    TableComponent,
    AddBookComponent,
    BarcodeScanComponent,
    FileUploadBooksComponent,
    AutofocusDirective,
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
    NgxQRCodeModule,
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
