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

  getAllUsers() {
    return this.http.get<User[]>(API.PROFILE.ALLUSERS);
  }


  getUserbyID(id: string): Observable<User|undefined>{
    console.log('calling: ' + id)
    return this.http.get<User>(`${API.PROFILE.USERINFO}/${id}`)
  }




  updateUser(image: File) {
    const formData = new FormData();
    formData.append('image', image, image.name);
    return this.http.put<User>(API.PROFILE.UPDATEUSER, formData);
  }
}
