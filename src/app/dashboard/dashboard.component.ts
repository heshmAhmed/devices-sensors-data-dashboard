import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SensorDataService } from './sensor-data.service';
import { DeviceSensorData } from '../device-sensor-data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private sseSubscription?: Subscription;
  hexData = '';
  private unsubscribe$ = new Subject<void>();
  pagedTableData: DeviceSensorData[] = [];
  page = 1;
  pageSize = 4;
  totalElements = 0;
  numOfPages = 1;
  selectedDeviceId = '';


  constructor(private sensorDataService: SensorDataService) { }

  ngOnInit(): void {
    this.laodDashboardData();

    this.sensorDataService.SubscribeToSensorDataServerEvents().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.fillTableData(data)
      }
      , error: (error) => {
        console.error('SSE error:', error)
      }
    });
  }

  private fillTableData(data: any): void {
    this.pagedTableData = data.content;
    this.totalElements = data.totalElements;
    this.numOfPages = data.totalPages;
    console.log('SSE data:', this.pagedTableData);
  }



  laodDashboardData(): void {
    this.sensorDataService.getDashboardData(this.page - 1, this.pageSize).pipe(takeUntil(this.unsubscribe$))
    .subscribe(resp => {
      this.fillTableData(resp);
      console.log(resp)
    });
  }

  sendData(): void {
    this.sensorDataService.sendData(this.hexData);
    this.hexData = '';
  }

  onPageChange(page: number): void {
    this.page = page;
    this.laodDashboardData();
  }

  ngOnDestroy(): void {
    this.sseSubscription?.unsubscribe();
    this.sensorDataService.UnSubscribeSensorDataServerEvents();
    this.unsubscribe$.unsubscribe();
  }

  onRowClicked(deviceId: string): void {
    this.selectedDeviceId = deviceId;
  }

}
