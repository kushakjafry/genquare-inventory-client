import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BooksTableDataSource } from './books-table-datasource';
import { BOOK } from '../model/book';
import { BookService } from '../services/book.service';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.scss'],
})
export class BooksTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<BOOK>;
  dataSource: BooksTableDataSource;
  showCheck: boolean = false;
  Books: BOOK[];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['skuId', 'name', 'stocks', 'edit'];

  constructor(
    private bookService: BookService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}
  ngOnInit() {
    this.bookService.getBooks().subscribe(
      (books) => {
        this.Books = books;
        this.dataSource = new BooksTableDataSource(books);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
      },
      (err) => {
        console.log(err);
        this.dataSource = new BooksTableDataSource([]);
        if (err.indexOf('401') !== -1) {
          this.snackbarService.openSnackBar(
            'Kindly Login to continue',
            'cancel'
          );
          this.router.navigateByUrl('/login');
        } else {
          this.snackbarService.openSnackBar(
            'Some error occured kindly visit after sometime',
            'cancel'
          );
        }
      }
    );
  }

  documentSearching(skuId: string): any {
    let firstChar = skuId.charAt(0);
    let remainingChar = skuId.substring(1);
    let searchingClass = `.\\3${firstChar} ${remainingChar}`;
    let data = document.querySelectorAll(`${searchingClass} input`);
    let checkButton = document.querySelector(`${searchingClass} .check_button`);
    let editButton = document.querySelector(`${searchingClass} .edit_button`);
    return {
      searchString: searchingClass,
      searchClass: data,
      checkButton: checkButton,
      editButton: editButton,
    };
  }

  edit(row: any) {
    let skuId: string = row.skuId;
    let search = this.documentSearching(skuId);
    search.searchClass.forEach((inputs) => {
      inputs.removeAttribute('disabled');
    });
    search.checkButton.classList.remove('hidden');
    search.editButton.classList.add('hidden');
  }

  save(row: any) {
    let skuId: string = row.skuId;
    let search = this.documentSearching(skuId);
    let spinner = document.querySelector(`${search.searchString} .mat-spinner`);
    search.checkButton.classList.add('hidden');
    spinner.classList.remove('hidden');
    let name = document.querySelector(
      `${search.searchString} input[name="name"]`
    )
      ? document.querySelector<any>(`${search.searchString} input[name=name]`)
          .value
      : null;
    let stocks = document.querySelector(
      `${search.searchString} input[name="stocks"]`
    )
      ? document.querySelector<any>(
          `${search.searchString} input[name="stocks"]`
        ).value
      : null;
    let index = this.Books.indexOf(row);
    this.bookService.updateBook(skuId, name, stocks).subscribe(
      (book: BOOK) => {
        this.Books[index] = book;
        this.dataSource = new BooksTableDataSource(this.Books);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        this.snackbarService.openSnackBar(`updated ${book.name}`, 'cancel');
        spinner.classList.add('hidden');
        search.editButton.classList.remove('hidden');
      },
      (err) => {
        this.snackbarService.openSnackBar('some error occured', 'cancel');
        search.searchClass.forEach((inputs) => {
          inputs.setAttribute('disabled', '');
          spinner.classList.add('hidden');
          search.editButton.classList.remove('hidden');
        });
      }
    );
  }
}
