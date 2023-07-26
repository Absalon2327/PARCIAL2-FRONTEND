import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoVehiculo } from '../interfaces/tipo-vehiculo.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoVehiculoService {
  url = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  getTipoVehiculos(): Observable<TipoVehiculo[]>{
    return this.http.get<TipoVehiculo[]>(`${this.url}/vehiculo`);
  }
  

  nuevoTipoVehiculo(tipoV: TipoVehiculo){
    return this.http.post(`${this.url}/vehiculo`, tipoV);
  }

  eliminarTipoVehiculo(id: number):Observable<TipoVehiculo>{
    return this.http.delete<TipoVehiculo>(`${this.url}/vehiculo/${id}`);
  }

  
}
