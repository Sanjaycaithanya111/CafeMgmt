import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/service/product.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns:string[] = ['name','categoryName','description','price','edit'];
  dataSource:any;
  length1:any;
  responseMessage:any;
  constructor(private productService:ProductService,
    private spinner:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbar:SnackBarService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.spinner.start();
    this.tableData();
  }

  tableData(){
    this.productService.getProducts().subscribe(
      (data:any) => {
        this.spinner.stop();
        this.dataSource = new MatTableDataSource(data);
      },(error:any) => {
        this.spinner.stop();
        console.log(error.error?.message);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }
        else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbar.openDialogBox(this.responseMessage,GlobalConstants.error);
      }
    )
  }

  applyFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action:'Add'
    };

    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(
      () => {
        dialogRef.close();
      }
    );
    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
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
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(
      () => {
        dialogRef.close();
      }
    );
    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (data) => {
        this.tableData();
      }
    )
  }
  handleDeleteAction(values:any){

  }

  onChange(status:any,id:any){

  }

}
