import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/common/book';
import { BookService } from 'src/app/services/book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  books:Book[];
  currentCategoryId:number=1;
  searchMode:boolean=false;

  currentPage:number=1;
  pageSize:number=5;
  totalRecords:number=0;

  constructor(private _bookService:BookService,
          private _activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(()=>{
      this.listBooks();
    });
  }

  listBooks(){
    this.searchMode=this._activatedRoute.snapshot.paramMap.has('keyword');
    if (this.searchMode){
      //do search work
      this.handleSearchBooks();
    }else{
      //display books based on category
      this.handleListBook();
    }

  }

  handleListBook(){
    const hasCategoryId: boolean=this._activatedRoute.snapshot.paramMap.has('id');

    if(hasCategoryId){
    this.currentCategoryId=+this._activatedRoute.snapshot.paramMap.get('id');
    }else{
      this.currentCategoryId = 2;
    }
    
        this._bookService.getBooks(this.currentCategoryId,this.currentPage - 1 ,this.pageSize)
        .subscribe(this. processResult());
  }

  handleSearchBooks(){
     const keyword:string= this._activatedRoute.snapshot.paramMap.get('keyword');
     this._bookService.searchBooks(keyword).subscribe(
       data=> {
         this.books=data;
         
       }
     );
    }

    updatePageSize(pageSize: number) {
      this.pageSize = pageSize;
      this.currentPage = 1;
      this.listBooks();
    }

    processResult(){
      return data => {
        this.books = data._embedded.books;
        this.currentPage = data.page.number + 1;
        this.totalRecords = data.page.totalElements;
        this.pageSize = data.page.size;
      }
    }

}
