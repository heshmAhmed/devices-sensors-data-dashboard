import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SensorDataService } from '../sensor-data.service';
import { DeviceSensorData } from '../../device-sensor-data.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-device-sensor-data-list',
  templateUrl: './device-sensor-data-list.component.html',
  styleUrl: './device-sensor-data-list.component.css'
})
export class DeviceSensorDataComponent implements OnInit, OnChanges {
  @Input("selectedDeviceId") deviceId: string = '';
  deviceSensorDataList: DeviceSensorData[] = [];
  private unsubscribe$ = new Subject<void>();
  page = 1;
  pageSize = 4;
  totalElements = 0;
  numOfPages = 1;

  constructor(private sensorDataService: SensorDataService) { }

  ngOnChanges(changes: any): void {
    this.initPageVariables();
    changes.deviceId.currentValue && changes.deviceId.currentValue != changes.deviceId.previousValue
      && this.loadDeviceSensorData();
    
  }

  ngOnInit(): void {
    this.loadDeviceSensorData();
  }

  loadDeviceSensorData(): void {
    this.sensorDataService.getDeviceSensorData(this.deviceId, this.page - 1, this.pageSize).pipe(takeUntil(this.unsubscribe$))
      .subscribe(resp => {
        this.totalElements = resp.totalElements;
        this.numOfPages = resp.totalPages;
        this.deviceSensorDataList = resp.content;
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadDeviceSensorData();
  }


  initPageVariables(): void { 
    this.page = 1;
    this.pageSize = 4;
    this.totalElements = 0;
    this.numOfPages = 1;
  }

}
