import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceSensorData } from '../device-sensor-data.model';

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  private eventSource?: EventSource;

  constructor(private http: HttpClient, private _zone: NgZone) { }


  getDeviceSensorData(deviceId: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('size', pageSize.toString());
    return this.http.get<any>('http://localhost:8080/devices-sensors-data/' + deviceId, {params});
  }


  getDashboardData(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('size', pageSize.toString())
      .append('sort', 'timestamp,desc');
    return this.http.get<any>('http://localhost:8080/devices-sensors-data', { params });
  }
  
  sendData(data: string): void {
    this.http.post('http://localhost:8080/devices-sensors-data', {hexData: data}).subscribe();
  }

  SubscribeToSensorDataServerEvents(): Observable<any> {
    return new Observable<any>(observer => {
      this.eventSource = new EventSource('http://localhost:8080/devices-sensors-data/sse');
      this.eventSource.onmessage = event =>this._zone.run(() => observer.next(JSON.parse(event.data)));
      this.eventSource.onerror = error => observer.error(error);
    });
  }

  UnSubscribeSensorDataServerEvents(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}