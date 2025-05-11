import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { UserService } from 'src/app/service/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  oldPassword = true;
  newPassword = true;
  confirmPassword = true;
  responseMessage:any;
  changePasswordForm:any;
  constructor(
    private fb:FormBuilder,
    private userService:UserService,
    private router:Router,
    private spinner:NgxUiLoaderService,
    private dialogRef:MatDialogRef<ChangePasswordComponent>,
    private snackbarService:SnackBarService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword:[null,Validators.required],
      newPassword:[null,Validators.required],
      confirmPassword:[null,Validators.required]
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
      return true;
    }
    return false;
  }

  handlePasswordChangeSubmit(){
    this.spinner.start();
    const formData = this.changePasswordForm.value;
    var data = {
      oldPassword : formData.oldPassword,
      newPassword : formData.newPassword,
      confirmPassword : formData.confirmPassword,
    }

    this.userService.changePassword(data)
      .subscribe(
        (data:any) => {
          this.spinner.stop();
          this.responseMessage = data?.message;
          this.dialogRef.close();
          this.snackbarService.openDialogBox(this.responseMessage,"success");
        },(error:any) => {
          console.log(error);
          this.spinner.stop();
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

}
