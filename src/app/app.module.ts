import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { SensorDataService } from "./dashboard/sensor-data.service";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CommonModule } from "@angular/common";
import { DeviceSensorDataComponent } from "./dashboard/device-sensor-data-list/device-sensor-data-list.component";
import { BrowserModule } from "@angular/platform-browser";


@NgModule({
    declarations: [
        DashboardComponent,
        AppComponent,
        DeviceSensorDataComponent
    ],
    imports: [
        NgxPaginationModule,
        FormsModule,
        HttpClientModule,
        CommonModule,
        BrowserModule
    ],
    providers: [SensorDataService],
    bootstrap: [AppComponent],
})
export class AppModule {

}