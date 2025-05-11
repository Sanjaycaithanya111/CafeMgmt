import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from '../service/snack-bar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private fb:FormBuilder,
              private userService:UserService,
              private dialogRef:MatDialogRef<ForgotPasswordComponent>,
              private router:Router,
              private snackBar:SnackBarService,
              private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  forgotPassword(){
    if(this.forgotPasswordForm.valid){
      let formData = this.forgotPasswordForm.value;
      let data = {
        email:formData.email
      }
      this.ngxService.start();
      this.userService.forgotPassword(data)
        .subscribe(
          (data:any) => {
            this.ngxService.stop();
            this.dialogRef.close();
            this.responseMessage = data?.message;
            this.snackBar.openDialogBox(this.responseMessage,'');
          },
          (error) =>{
            this.ngxService.stop();
            this.dialogRef.close();
            if(error.error?.message){
              this.responseMessage = error.error?.message;
            }
            else{
              this.responseMessage = GlobalConstants.error;
            }
            this.snackBar.openDialogBox(this.responseMessage,'error');
          }
        )
    }
  }

}
