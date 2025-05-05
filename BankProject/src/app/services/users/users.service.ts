import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/Users';
import { API } from '../../services/index';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getMyProfile() {
    return this.http.get<User>(API.PROFILE.ME);
  }

  getMyCachedProfile(): User | null {
    let userJson = sessionStorage.getItem('userProfile');
    if (userJson) return JSON.parse(userJson) as User;
    else return null;
  }

  getAllUsers() {
    return this.http.get<User[]>(API.PROFILE.ALLUSERS);
  }

  getUserbyID(id: string): Observable<User | undefined> {
    // let myUser = this.getMyCachedProfile();
    // console.log('myUser: ' + myUser?._id + ' id: ' + id);
    // if (myUser && myUser._id == id)
    //   return new Observable<User | undefined>((observer) =>
    //     observer.next(myUser)
    //   );
    console.log('calling: ' + id);
    return this.http.get<User>(`${API.PROFILE.USERINFO}/${id}`);
  }

  updateUser(image: File) {
    const formData = new FormData();
    formData.append('image', image, image.name);
    return this.http.put<User>(API.PROFILE.UPDATEUSER, formData);
  }
}
