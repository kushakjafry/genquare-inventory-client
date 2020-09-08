import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BOOK } from '../model/book';
import { BookService } from '../services/book.service';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  showStartingSpinner: boolean = true;
  displayedColumns: string[] = ['skuId', 'name', 'stocks', 'edit'];
  dataSource: MatTableDataSource<BOOK>;
  Books: BOOK[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private bookService: BookService,
    private snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(
      (books: BOOK[]) => {
        this.Books = books;
        this.showStartingSpinner = false;
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(books);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.snackBarService.openSnackBar('All books loaded', 'cancel');
      },
      (err) => {
        this.showStartingSpinner = false;
        if (err.indexOf('401') !== -1) {
          this.snackBarService.openSnackBar(
            'Kindly Login to continue',
            'cancel'
          );
          this.router.navigateByUrl('/login');
        } else {
          this.dataSource = new MatTableDataSource([]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.snackBarService.openSnackBar(
            'Some error occured kindly try after sometime',
            'cancel'
          );
        }
      }
    );
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // intialization searching of certain element on dom
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

  // editing a book
  edit(row: any) {
    let skuId: string = row.skuId;
    let search = this.documentSearching(skuId);
    search.searchClass.forEach((inputs) => {
      inputs.removeAttribute('disabled');
    });
    search.checkButton.classList.remove('hidden');
    search.editButton.classList.add('hidden');
  }

  // updating a book
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
        this.dataSource = new MatTableDataSource(this.Books);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.snackBarService.openSnackBar(`updated ${book.name}`, 'cancel');
        spinner.classList.add('hidden');
        search.editButton.classList.remove('hidden');
      },
      (err) => {
        this.snackBarService.openSnackBar('some error occured', 'cancel');
        search.searchClass.forEach((inputs) => {
          inputs.setAttribute('disabled', '');
          spinner.classList.add('hidden');
          search.editButton.classList.remove('hidden');
        });
      }
    );
  }
}
