import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/service/category.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumns: string[] = ['name','edit'];
  dataSource:any;
  responseMessage:any;

  constructor(private categoryService:CategoryService,
    private spinner:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackBarService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.spinner.start();
    this.tableData();
  }

  tableData(){
    this.categoryService.getCategorys().subscribe(
      (data:any) => {
         this.spinner.stop();
         this.dataSource = new MatTableDataSource(data);
      },(error) => {
           this.spinner.stop();
           console.log(error.error?.message);
           if(error.error?.message){
            this.responseMessage = error.error?.message;
           }
           else{
            this.responseMessage = GlobalConstants.genericError;
           }
           this.snackbarService.openDialogBox(this.responseMessage,GlobalConstants.error);
      }
    )

  }

  applyFilter(event:Event){
    const filtervalue = (event?.target as HTMLInputElement).value;
    this.dataSource.filter = filtervalue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Add'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(
      () => {
        dialogRef.close();
      }
    );
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (data) => {
        this.tableData();
      }
    )
  }
  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Edit',
      data:values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(
      () => {
        dialogRef.close();
      }
    );
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
      (data) => {
        this.tableData();
      }
    )
  }

}
