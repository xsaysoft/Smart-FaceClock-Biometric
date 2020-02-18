import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-clocking',
  templateUrl: './clocking.page.html',
  styleUrls: ['./clocking.page.scss'],
})
export class ClockingPage implements OnInit {
  photo: SafeResourceUrl = "/assets/user.png";
  _isLoading:any
  public ishidden_liviness = true;
  public ishidden_verify = true
  public ishidden_loader= true
  public ishidden_btn = true;
  requestHeaders = new HttpHeaders().set('Authorization', 'Basic QXBwbWFydEJpbzoxMjM0NTY=');
  constructor(private sanitizer: DomSanitizer,public httpClient: HttpClient,
     private auth: AuthService,
     private alertCtrl: AlertController
   
     ) {  }
   
  public userData=this.auth.getUser()

  ngOnInit( ) {  }


  async cAlert(messg:any) {
    const alert = await this.alertCtrl.create({
      message: messg,
      buttons: ['OK']
    });

    await alert.present();
  }

  private async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    const IgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    
    this.photo = IgUrl
    const imURL= image.dataUrl;
    let dataURL = imURL.substr(imURL.indexOf(',') + 1);
    this. Upload(dataURL)

  

  }


  Upload(dataURL:any) {
    this.ishidden_liviness= false;
    this.ishidden_loader = false;
    var headers = new Headers();
    var captured=1
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Authorization', 'Bearer ' +this.userData.token);
    const url="https://aws.appmartgroup.com/app/api/v1.0/upload";
    
  
    let postData = "{\n\t\"DataUrl\": \"" + dataURL + "\",\n\t\"index\": \"" + captured + "\"\n}"

    let YourHeaders = {
      "Content-Type": "application/json",
      'aws-token': this.userData.token
    };
    this.httpClient.post(url, postData, {headers: YourHeaders})
      .subscribe(data => {
      this.PerformDetectLivness()
      console.log(data)
    },
    (error) => {
      this.ishidden_liviness= true;
      this.ishidden_loader = true;
      this.cAlert("Connection Failure,  Try Again")
      console.log("Error" + error)
    })
  }

  /**
   *  PerformDetectLivness
   */

  PerformDetectLivness() {
    this.ishidden_liviness= false;
    this.ishidden_loader = false;

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Authorization', 'Bearer ' +this.userData.token);
    const url="https://aws.appmartgroup.com/app/api/v1.0/face/liveness";
    
  
    let postData = ""

    let YourHeaders = {
      "Content-Type": "application/json",
      'aws-token': this.userData.token
    };
    this.httpClient.post(url, postData, {headers: YourHeaders})
      .subscribe(data => {
      this.ishidden_liviness= true;
      console.log(data)
      if (data['Accepted']==true) {
     console.log("status",data['Accepted'])
       this.PerformBiometricTask()  
        // this.cAlert("Start Biometric")   
     } else {
      this.ishidden_liviness= true;
      this.ishidden_loader = true;
      this.photo = "/assets/error.png";
      this.cAlert("Image Quality Failed  Try Again")

     }
    },
    (error) => {
      this.ishidden_liviness= true;
      this.ishidden_loader = true;
      this.cAlert("Connection Failure,  Try Again")
      console.log("Error" + error)
    })
  }

/**
   *  PerformBiometricTask
   */

  PerformBiometricTask() {
    this.ishidden_verify = false;
    this.ishidden_loader = false;

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Authorization', 'Bearer ' +this.userData.token);
    const url="https://aws.appmartgroup.com/app/api/v1.0/verify";
    
  
    let postData = ""

    let YourHeaders = {
      "Content-Type": "application/json",
      'aws-token': this.userData.token
    };
    this.httpClient.post(url, postData, {headers: YourHeaders})
      .subscribe(data => {
        this.ishidden_verify = true;
        this.ishidden_loader = true;
      console.log(data)

      var ScoreClass = data['Matches'].confidence;
          console.log(ScoreClass)
              //Biometric Log
          if (ScoreClass >= 0.8500) {
            this.photo = "/assets/success.png";
              //Bio_logVerify(2, classID, KeyID, ScoreClass1, '1', UserID)
              this.cAlert("Your Biometric Verification Was Successful!!")
          } else {
            this.photo = "/assets/error.png";
            //Bio_logVerify(2, classID, KeyID, ScoreClass1, '0', UserID)
              this.cAlert("Unable To Verify Your Biometric!!");
          }
  
    },
    (error) => {
      this.ishidden_verify = true;
      this.ishidden_loader = true;
      this.photo = "/assets/error.png";
      this.cAlert("Invalid Biometric, make sure you are already enrolled to smart clock in ")
      console.log("Error" + error)
    })
  }



}
