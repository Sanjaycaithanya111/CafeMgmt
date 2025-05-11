import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackBarService } from '../service/snack-bar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signUpForm:any = FormGroup;
  resposnseMessage:any;
  constructor(
    private fb:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackBarService:SnackBarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService

  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: new FormControl('',[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]),
      email: new FormControl('',[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]),
      contactNumber: new FormControl('',[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]),
      password: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('',[Validators.required])
    })
  }

  validateSubmit(){
    if(this.signUpForm.controls['password'].value != this.signUpForm.controls['confirmPassword'].value){
      return true;
    }
    else {
      return false;
    }
  }

  handleSubmit(){
    this.ngxService.start();
    let formData = this.signUpForm.value;
    let data = {
      name:formData.name,
      email:formData.email,
      mobile:formData.contactNumber,
      password:formData.password
    }

    this.userService.signUp(data)
      .subscribe(
        (data:any)=>{
          this.ngxService.stop();
          this.dialogRef.close();
          this.resposnseMessage = data?.message;
          this.snackBarService.openDialogBox(this.resposnseMessage,'');
          this.router.navigate(['/']);
        },
        (error)=>{
          this.ngxService.stop();
          this.dialogRef.close();
          if(error.error?.message){
            this.resposnseMessage = error.error?.message;
          }
          else{
            this.resposnseMessage = GlobalConstants.error;
          }
          this.snackBarService.openDialogBox(this.resposnseMessage,GlobalConstants.error);
        }
      )
  }

}
