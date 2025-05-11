import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackbar:MatSnackBar) { }

  openDialogBox(message:string,action:any){
    if(action === 'close'){
      this.snackbar.open(message,'',{
        horizontalPosition:'center',
        verticalPosition:'top',
        duration:2000,
        panelClass:['black-snackbar']
      })
    }
    else{
      this.snackbar.open(message,'',{
        horizontalPosition:'center',
        verticalPosition:'top',
        duration:2000,
        panelClass:['green-snackbar']
      })
    }
  }
}
