import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { map } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth,
               private router: Router,
               private afDB: AngularFirestore ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( ( fbUser: firebase.User) => {
    console.log(fbUser.email);
    });
  }

  createUser(nombre: string, email: string, password: string) {

    this.afAuth.auth
    .createUserWithEmailAndPassword( email, password)
    .then( resp => {
      // console.log(resp);
      const user: User = {
        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email
      };
      this.afDB.doc(`${user.uid}/usuario`)
      .set( user )
      .then(() => {
        this.router.navigate(['/']);
      });
    })
    .catch( error => {
      console.error(error);
      Swal.fire( 'Error en el register', error.message, 'error');
    });
  }

  login( email1: string, password1: string) {
    this.afAuth.auth
    .signInWithEmailAndPassword( email1, password1)
    .then( resp => {
      // console.log(resp);
      this.router.navigate(['/']);
    })
    .catch( error => {
      console.error(error);
      Swal.fire( 'Error en el login', error.message, 'error');
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState
    .pipe(
      map( fbUser => {

        if ( fbUser == null ) {
          this.router.navigate(['/login']);
        }
      return  fbUser != null;
    })
    );
  }

}
