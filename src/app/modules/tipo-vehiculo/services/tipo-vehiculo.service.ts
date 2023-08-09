import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { TipoVehiculo } from "../interfaces/tipo-vehiculo.interface";
import { catchError } from "rxjs/operators";

import { Img, PdfMakeWrapper, Table, Txt } from "pdfmake-wrapper";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
PdfMakeWrapper.setFonts(pdfFonts);

@Injectable({
  providedIn: "root",
})
export class TipoVehiculoService {
  url = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  getTipoVehiculos(): Observable<TipoVehiculo[]> {
    return this.http.get<TipoVehiculo[]>(`${this.url}/vehiculo`);
  }

  nuevoTipoVehiculo(tipoV: TipoVehiculo) {
    return this.http.post(`${this.url}/vehiculo`, tipoV);
  }
  nuevoTipoVehiculoImagen(imagen: File[], tipov: TipoVehiculo) {
    const formData = new FormData();
    imagen.forEach((archivo) => {
      formData.append("imagen", archivo);
      formData.append("tipoVehiculo", tipov.tipoVehiculo);
    });
    return this.http.post(`${this.url}/vehiculo/insertar`, formData).pipe(
      catchError((err: HttpErrorResponse) => {
        return this.errorHandler(err);
      })
    );
  }
  errorHandler(error: HttpErrorResponse): Observable<never> {
    if (error.status == 500)
      return throwError(() => new Error(error.statusText));
    if (error.status == 400) return throwError(() => new Error("Algo pasó"));
    return throwError(() => new Error("Error al subir archivos"));
  }

  editarTipoVehiculo(tipoV: TipoVehiculo) {
    console.log("tipoV in service: ", tipoV);

    return this.http.put(`${this.url}/vehiculo`, tipoV);
  }

  eliminarTipoVehiculo(id: number): Observable<TipoVehiculo> {
    return this.http.delete<TipoVehiculo>(`${this.url}/vehiculo/${id}`);
  }

  async generarPDF(titulo: string, datos: TipoVehiculo[]) {
    const pdf = new PdfMakeWrapper();
    pdf.header(
      new Txt(`${titulo}`).alignment("right").italics().margin(10).end
    );
    pdf.add(
      new Txt("REPORTE DE TIPOS DE VEHÍCULOS")
        .color("black")
        .fontSize(18)
        .bold()
        .alignment("center").end
    );
    pdf.add(new Txt("").margin(15).end);
    pdf.add(
      await new Img("assets/images/minerva2.png")
        .height(50)
        .width(50)
        .absolutePosition(60, 40)
        .build()
    );
    pdf.add(new Txt("").margin(15).end);
    //CUERPO DEL REPORTE
    pdf.add(
      new Txt("TIPO DE VEHÍCULO:").margin(15).bold().decoration("underline").end
    );
    pdf.add(new Txt("").margin(15).end);
    pdf.add(
      new Table([["No.", "FOTO", "TIPO"]])
        .alignment("center")
        .widths([200, 200, 150])
        .fontSize(12)
        .italics()
        .bold()
        .layout("lightHorizontalLines").end
    );
    //RECORRIDO DE LOS DATOS
    for (let x of datos) {
      pdf.add(
        new Table([
          ["", "", ""],
          [
            `${x.id}`,
            await new Img(`${x.urlImagen}`)
              .height(50)
              .width(50)
              .build(),
            `${x.tipoVehiculo}`,
          ],
        ])
          .alignment("center")
          .widths([200, 200, 150])
          .fontSize(10)
          .layout("lightHorizontalLines").end
      );
    }

    //Pie de página
    pdf.add(new Txt("").margin(20).end);
    pdf.footer(
      new Txt("" + this.fechaFormato()).alignment("left").italics().margin(10)
        .end
    );
    //Para que se abra
    pdf.pageOrientation("landscape");
    pdf.create().open();
  }

  fechaFormato() {
    const fechaActual = new Date();

    // Función para agregar ceros a la izquierda si el número es menor que 10
    function agregarCeros(numero) {
      return numero < 10 ? "0" + numero : numero;
    }

    // Obtener las partes de la fecha
    const dia = agregarCeros(fechaActual.getDate());
    const mes = agregarCeros(fechaActual.getMonth() + 1); // Los meses van de 0 a 11
    const anio = fechaActual.getFullYear();
    const horas = agregarCeros(fechaActual.getHours());
    const minutos = agregarCeros(fechaActual.getMinutes());
    const segundos = agregarCeros(fechaActual.getSeconds());

    // Formatear la fecha en el formato deseado
    const formatoDeseado = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
    return formatoDeseado;
  }
}
