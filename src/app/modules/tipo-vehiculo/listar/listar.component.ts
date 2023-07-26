import { Component, Input, OnInit } from "@angular/core";
import { TipoVehiculoService } from "../services/tipo-vehiculo.service";
import { TipoVehiculo } from "../interfaces/tipo-vehiculo.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  NAME_VALIDATE,
  NUMBER_VALIDATE,
  URLIMAGENES,
} from "../../constants/constants";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import Swal from "sweetalert2";
import { Login2Component } from "../../../account/auth/login2/login2.component";

@Component({
  selector: "app-listar",
  templateUrl: "./listar.component.html",
  styleUrls: ["./listar.component.scss"],
})
export class ListarComponent implements OnInit {
  tipoVehiculo!: TipoVehiculo[];
  ItipoVehiculo!: TipoVehiculo;
  formTVehiculo!: FormGroup;
  private isLetras: string = NAME_VALIDATE;
  private isNumero: string = NUMBER_VALIDATE;
  term: string;
  breadCrumbItems: Array<{}>;

  constructor(
    private tvService: TipoVehiculoService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal
  ) {}

  config: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    /*  maxFilesize: 50,
    acceptedFiles: "image/*",
    method: "POST",
    uploadMultiple: false, <dropzone class="dropzone" [config]="config"></dropzone>
    accept: (file) => {
      this.onAccept(file);
    }, */
  };
  image = "";
  file = "";
  onAccept(file: any) {
    this.image = file.name;
    this.file = file;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Tipo de Vehículos" },
      { label: "Listar", active: true },
    ];
    this.getTipoVehiculos();
    this.formTVehiculo = this.iniciarFormulario();
  }
  @Input() queryString: string;
  p: any;

  getTipoVehiculos() {
    this.tvService.getTipoVehiculos().subscribe({
      next: (response) => {
        console.log("vehiculos: ", response);
        this.tipoVehiculo = response;
      },
    });
  }

  private iniciarFormulario(): FormGroup {
    return this.fb.group({
      tipoVehiculo: [
        "",
        [Validators.required, Validators.pattern(this.isLetras)],
      ],
    });
  }

  loadTipo(tipoV: TipoVehiculo) {
    if (tipoV) {
      console.log("tipoV: ", tipoV);
      this.formTVehiculo.reset({
        tipoVehiculo: tipoV.tipoVehiculo,
      });
    }
  }

  guardar() {
    if (this.formTVehiculo.invalid) {
      Swal.fire({
        position: "center",
        title: "Faltan datos en el formulario",
        text: "submit disparado, formulario No valido",
        icon: "warning",
      });
    } else {
      this.guardarTipoVehiculo();
    }
    return Object.values(this.formTVehiculo.controls).forEach((control) =>
      control.markAsTouched()
    );
  }

  guardarTipoVehiculo() {
    const tipoV = this.formTVehiculo.value;
    this.tvService.nuevoTipoVehiculo(tipoV).subscribe({
      next: (response) => {
        if (response) {
          Swal.fire({
            position: "center",
            title: "Buen trabajo",
            text: "Datos guardados con exito",
            icon: "success",
          });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Buen trabajo",
            text: "Datos guardados con exito",
            confirmButtonText: "OK",
            reverseButtons: true,
          }).then((result: any) => {
            if (result.isConfirmed) {
              this.formTVehiculo.reset();
              this.reload();
              this.modalService.dismissAll();
            }
          });
        }
      },
      error: () => {
        Swal.fire({
          title: "Error",
          text: "Algo pasó hable con el Administrador",
          icon: "error",
        });
      },
    });
  }
  modificar() {}

  editando() {}

  eliminar(id: TipoVehiculo) {
    Swal.fire({
      icon: "question",
      title: "¿Estas seguro de eliminar?",
      text: `Esta seguro de borrar a  ${id.tipoVehiculo}`,
      showCancelButton: true,
      confirmButtonColor: "#DC3545",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.tvService.eliminarTipoVehiculo(id.id).subscribe({
          next: (resp) => {
            console.log("resp: ", resp);

            if (resp) {
              Swal.fire({
                position: "center",
                title: "Buen trabajo",
                text: "Datos eliminados con exito",
                icon: "success",
              });
              this.reload();
            }
          },
          error: () => {
            Swal.fire({
              title: "Error",
              text: "Algo pasó hable con el Administrador",
              icon: "error",
            });
          },
        });
      }
    });
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formTVehiculo.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? "is-invalid"
      : validarCampo?.touched
      ? "is-valid"
      : "";
  }
  openModal(content: any) {
    console.log("Tipo Vehículo: ", this.ItipoVehiculo);
    this.modalService.open(content, { centered: true });
  }
  reload() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }
}
