import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackBarService } from './snack-bar.service';
import  jwt_decode  from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';
@Injectable({
  providedIn: 'root'
})
export class RouteGaurdService {

  constructor(private authService:AuthService,
              private router:Router,
              private snackBar:SnackBarService
  ) { }


  canActivate(route:ActivatedRouteSnapshot):boolean{
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;
    
    const token:any = localStorage.getItem('token');

    var tokenPayload:any;

    try{
      tokenPayload = jwt_decode(token);
    }catch(error){
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let expectedRole = '';
    for(let i=0;i<expectedRoleArray.length;i++){
      if(expectedRoleArray[i] == tokenPayload.role){
        expectedRole = tokenPayload.role;
      }
    }

    if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
      if(this.authService.isAuthenticated() && tokenPayload.role == expectedRole ){
        return true;
      }
      else{
        this.snackBar.openDialogBox(GlobalConstants.unauthorized,GlobalConstants.error);
        this.router.navigate(['/cafe/dashboard']);
        return false;
      }
    }
    else{
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }

  }
}
