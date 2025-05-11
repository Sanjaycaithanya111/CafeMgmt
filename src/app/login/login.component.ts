import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from '../service/snack-bar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm:any = FormGroup;
  responseMessage:any;

  constructor(private fb:FormBuilder,
              private userService:UserService,
              private dialogRef:MatDialogRef<LoginComponent>,
              private router:Router,
              private snackBar:SnackBarService,
              private ngxService:NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,[Validators.required]]
    })
  }

  login(){
    if(this.loginForm.valid){
      let formData = this.loginForm.value;
      let data = {
        email:formData.email,
        password:formData.password
      }
      this.ngxService.start();
      this.userService.login(data)
        .subscribe(
          (data:any) => {
            this.ngxService.stop();
            this.dialogRef.close();
            this.responseMessage = GlobalConstants.loginSuccesful;
            localStorage.setItem("token",data.token);
            console.log("token:"+localStorage.getItem('token'));
            this.snackBar.openDialogBox(this.responseMessage,'');
            this.router.navigate(['/cafe/dashboard']);
          },
          (error)=>{
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
