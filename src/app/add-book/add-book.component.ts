import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { SnackbarService } from '../services/snackbar.service';
import { BOOK } from '../model/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  bookForm: FormGroup;
  formErrors = {
    skuId: '',
    name: '',
    stocks: '',
  };
  validationMessages = {
    skuId: {
      required: 'skuId is required',
    },
    name: {
      required: 'name of book is required',
    },
    stocks: {
      required: "book's stock is required",
      pattern: 'Stocks can only be number',
    },
  };
  hideAddSpinner: boolean = true;
  @ViewChild('bookfrom') bookFormDirective;

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  //create form for adding books
  createForm() {
    this.bookForm = this.fb.group({
      skuId: ['', Validators.required],
      name: ['', Validators.required],
      stocks: ['', [Validators.required, Validators.pattern]],
    });
    this.bookForm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    console.log(this.bookForm.value);
    if (!this.bookForm) {
      return;
    }
    const form = this.bookForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.hideAddSpinner = false;
    let skuId = this.bookForm.value.skuId;
    let name = this.bookForm.value.name;
    let stocks = this.bookForm.value.stocks;
    this.bookService.postBook(skuId, name, stocks).subscribe(
      (book: BOOK) => {
        this.hideAddSpinner = true;
        this.snackbarService.openSnackBar(`added ${book.name}`, 'cancel');
      },
      (err) => {
        this.hideAddSpinner = true;
        if (err.indexOf('401') !== -1) {
          this.snackbarService.openSnackBar('Oops! kindly Login', 'cancel');
          this.router.navigateByUrl('/login');
        } else {
          this.snackbarService.openSnackBar(
            'Oops! Server Error please login after sometime',
            'cancel'
          );
        }
      }
    );
    this.bookForm.reset({
      skuId: '',
      name: '',
      stocks: '',
    });
    this.bookFormDirective.resetForm();
  }
}
