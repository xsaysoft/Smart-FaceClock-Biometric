import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient ,HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-clocking',
  templateUrl: './clocking.page.html',
  styleUrls: ['./clocking.page.scss'],
})
export class ClockingPage implements OnInit {
  photo: SafeResourceUrl = "/assets/user.png";
  requestHeaders = new HttpHeaders().set('Authorization', 'Basic QXBwbWFydEJpbzoxMjM0NTY=');
  constructor(private sanitizer: DomSanitizer,public httpClient: HttpClient) {  }

  ngOnInit() { 
   const token= this.token_g("09086985989")

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
    
  //alert(dataURL)

  

  }

// Generate Token 
private async token_g(phone:any) {
let url="https://aws.appmartgroup.com/App/service/api/Push/Mtokencall?phone="+phone
  this.httpClient.get(url).subscribe((response) => {
    //return response['token'] 
    console.log(response);
    
});

}

  Upload() {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    const url="https://aws.appmartgroup.com/app/api/v1.0/upload";

    let postData = {
            "name": "Customer004",
            "email": "customer004@email.com",
            "tel": "0000252525"
    }

    let YourHeaders = {'Content-Type':'application/json'};
    this.httpClient.post(url, postData, {headers: YourHeaders})
      .subscribe(data => {
      console.log(data)
    },
    (error) => {
            console.log("Error" + error)
    })
  }


}
