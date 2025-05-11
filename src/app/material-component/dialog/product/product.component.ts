import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any = "Add";
  action:any = "Add";
  responseMessage:any;
  categorys:any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formBuilder:FormBuilder,
    private productService:ProductService,
    public dialogRef:MatDialogRef<ProductComponent>,
    private categoryService:CategoryService,
    private snackbar:SnackBarService,
    private spinner:NgxUiLoaderService
) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name:new FormControl('',[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]),
      categoryId:new FormControl('',Validators.required),
      price:new FormControl('',Validators.required),
      description:new FormControl('',Validators.required)
    });

    if(this.dialogData.action === "Edit"){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getcategorys();
  }

  getcategorys(){
    this.categoryService.getCategorys()
    .subscribe(
      (data:any) => {
        this.categorys = data;
      },(error:any) => {
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

  handleSubmit(){
    if(this.dialogAction == "Edit"){
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.productForm.value;
    var data = {
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }

    this.productService.add(data).subscribe(
      (data:any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = data.message;
        this.snackbar.openDialogBox(this.responseMessage,"success");
      },(error) => {
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

  edit(){
    var formData = this.productForm.value;
    var data = {
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }

    this.productService.update(data).subscribe(
      (data:any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = data.message;
        this.snackbar.openDialogBox(this.responseMessage,"success");
      },(error) => {
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

}
