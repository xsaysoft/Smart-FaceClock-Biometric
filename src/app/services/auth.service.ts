
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
 
const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  _isLoading:any
  constructor(private storage: Storage, private http: HttpClient, private plt: Platform, 
    private router: Router,
    public loadingCtrl: LoadingController) { 
    this.loadStoredToken();  
  }
  

  async loader() {
    this._isLoading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 5000
    });
    await this._isLoading .present();

  }

  async end_loader(){
  await this._isLoading.dismiss();
    console.log('Loading dismissed!');
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());
 
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token); 
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }
 
  login(credentials: {phone: string }) {
//+credentials.phone
    // Normally make a POST request to your APi with your login credential
    let url="https://aws.appmartgroup.com/playground/service/api/Push/Mtokencall?phone="+credentials.phone
    return this.http.get(url).pipe(
      take(1),
      map(res => {
        // Extract the JWT, here we just fake it
        this.userData.next(res);
        console.log(res['token'])
        return res['token']
        
      }),
      switchMap(token => {
        let storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
      })
    );
  }
 
  getUser() {
    return this.userData.getValue();
  }



  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }
 
}