import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  postForm: any;
  isAlive: boolean = true;
  submitted: boolean = false;
  dataToUpdate: any

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    private fb: FormBuilder,
    private tostr: ToastrService,
    private _httpService: DateService) {

    this.dataToUpdate = this.data
    this.postForm = fb.group({
      "fname": ['', [Validators.required]],
      "lname": ['', [Validators.required]],
      "email": ['', [Validators.required, Validators.pattern('^[a-z0-9._+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      "mobile": ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      "gender": ['', [Validators.required]],
    })
  }

  get f() {
    return this.postForm.controls;
  }

  ngOnInit(): void {
    if (this.dataToUpdate !== '') {
      console.log("Data", this.dataToUpdate)
      this.postForm.setValue(
        {
          "fname": this.dataToUpdate.firstName,
          "lname": this.dataToUpdate.lastName,
          "email": this.dataToUpdate.email,
          "mobile": this.dataToUpdate.mobile,
          "gender": this.dataToUpdate.gender
        }
      )
    }
  }

  onlyChar(event: any) {
    const pattern = /[a-zA-Z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  resetIfOnlySpaces(ctrname) {
    const value = this.postForm.get(ctrname).value;
    if (value.trim() === '') {
      this.postForm.get(ctrname).reset();
    } else if (typeof value === 'string') {
      const newValue = value.replace(/\s+/g, ' ');
      this.postForm.get(ctrname).setValue(newValue, { emitEvent: false });
    }
  }

  onSubmit() {
    this.submitted = true
    if (this.postForm.valid) {
      if (this.dataToUpdate !== '') {
        this.update()
      } else {
        this.postData()
      }

    } else {
      this.tostr.warning("Required fields are missing")
    }
  }

  postData() {
    var obj = {
      "firstName": this.postForm.get('fname').value,
      "lastName": this.postForm.get('lname').value,
      "email": this.postForm.get('email').value,
      "mobile": this.postForm.get('mobile').value,
      "gender": this.postForm.get('gender').value,
    }
    this._httpService.PostData(obj).pipe(takeWhile(() => this.isAlive))
      .subscribe(res => {
        this.tostr.success("User is added")
        this.dialogRef.close('submitted')
      }, err => {

      })
  }

  update() {
    var obj = {
      "id": this.dataToUpdate.id,
      "firstName": this.postForm.get('fname').value,
      "lastName": this.postForm.get('lname').value,
      "email": this.postForm.get('email').value,
      "mobile": this.postForm.get('mobile').value,
      "gender": this.postForm.get('gender').value,
    }
    this._httpService.updateData(obj).pipe(takeWhile(() => this.isAlive))
      .subscribe(
        res => {
          this.dialogRef.close('updated')
        }, err => {

        }
      )
  }

  ngOnDestroy(): void {
    this.isAlive = false
  }
}
