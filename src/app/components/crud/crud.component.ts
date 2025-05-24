import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { DateService } from 'src/app/services/date.service';
import { takeWhile } from 'rxjs/operators'
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
  isAlive: boolean = true;
  allData : User[] = []
  constructor(
    private dialog : MatDialog,
    private _httpService : DateService,
    private _tostr : ToastrService
  ) { }

  ngOnInit(): void {
    this.getUser()
  }


  getUser(){
     this._httpService.getData().pipe(takeWhile(() => this.isAlive))
     .subscribe((res) =>{
       this.allData = res
     })
  }

  addUser() {
    let dialogRef = this.dialog.open(ModalComponent, {
      width: '30%',
      data:''
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'submitted'){
       this.getUser()
      } 
    });

  }

  updateData(data){
     let dialogRef = this.dialog.open(ModalComponent, {
      width: '30%',
      data:data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'updated'){
        this._tostr.success("User is updated")
       this.getUser()
      } 
    });
  }

  onDelete(id: number) {
  if (confirm('Are you sure you want to delete this user?')) {
    this._httpService.deleteData(id).subscribe(() => {
      console.log('User deleted:', id);
      this.getUser(); // Reload list if needed
    });
  }
}
}
