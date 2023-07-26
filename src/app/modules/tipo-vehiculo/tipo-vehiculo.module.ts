import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TipoVehiculoRoutingModule } from "./tipo-vehiculo-routing.module";
import { ListarComponent } from "./listar/listar.component";
import { ReportesComponent } from "./reportes/reportes.component";
import { UIModule } from "../../shared/ui/ui.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from 'ngx-pagination';
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { NgApexchartsModule } from "ng-apexcharts";
import { ChartsModule } from "ng2-charts";
import { NgxChartistModule } from "ngx-chartist";

@NgModule({
  declarations: [ListarComponent, ReportesComponent],
  imports: [
    CommonModule,
    TipoVehiculoRoutingModule,
    UIModule,
    HttpClientModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, //para las tablas
    Ng2SearchPipeModule,    
    NgxPaginationModule,
    DropzoneModule,
    NgApexchartsModule,    
    ChartsModule,
    NgxChartistModule
  ],
})
export class TipoVehiculoModule {}
