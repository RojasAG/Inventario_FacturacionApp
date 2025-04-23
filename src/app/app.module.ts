import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPrincipalComponent } from './login-principal/login-principal.component';
import { MenuCajeroComponent } from './menu-cajero/menu-cajero.component';
import { AuthGuard } from './services/auth-guard.service';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { VerProductosComponent } from './ver-productos/ver-productos.component';
import { VerFacturasComponent } from './ver-facturas/ver-facturas.component';
import { VerCierresComponent } from './ver-cierres/ver-cierres.component';
import { UserInfoModalComponent } from './user-info-modal/user-info-modal.component';
import { FormsModule } from '@angular/forms';
import { ModificarProductoComponent } from './modificar-producto/modificar-producto.component';
import { AgregarProductoModalComponent } from './agregar-producto-modal/agregar-producto-modal.component';
import { BorrarProductoComponent } from './borrar-producto/borrar-producto.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { VerProductosModalComponent } from './ver-productos-modal/ver-productos-modal.component';
import { VerFacturasCajeroComponent } from './ver-facturas-cajero/ver-facturas-cajero.component';
import { VerCierresCajeroComponent } from './ver-cierres-cajero/ver-cierres-cajero.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VerFacturasCierreComponent } from './ver-facturas-cierre/ver-facturas-cierre.component';
import { VerFacturasCierreCajeroComponent } from './ver-facturas-cierre-cajero/ver-facturas-cierre-cajero.component';
import { VerFacturasBorradasComponent } from './ver-facturas-borradas/ver-facturas-borradas.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogBorrarFacturaComponent } from './confirm-dialog-borrar-factura/confirm-dialog-borrar-factura.component';
import { MatInputModule } from '@angular/material/input';
import { VerModInfoFactComponent } from './ver-mod-info-fact/ver-mod-info-fact.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SidebarAdminMenuComponent } from './sidebar-admin-menu/sidebar-admin-menu.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerFacturasAdminComponent } from './ver-facturas-admin/ver-facturas-admin.component';
import { VerFacturaModalComponent } from './ver-factura-modal/ver-factura-modal.component';
import { VerFacturaBorradaModalComponent } from './ver-factura-borrada-modal/ver-factura-borrada-modal.component';
import { MostrarFacturasCierreModalComponent } from './mostrar-facturas-cierre-modal/mostrar-facturas-cierre-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { VerCierresMesComponent } from './ver-cierres-mes/ver-cierres-mes.component';
import { AgregarCajeroComponent } from './agregar-cajero/agregar-cajero.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginPrincipalComponent,
    MenuCajeroComponent,
    AgregarProductoComponent,
    VerProductosComponent,
    VerFacturasComponent,
    VerCierresComponent,
    UserInfoModalComponent,
    ModificarProductoComponent,
    AgregarProductoModalComponent,
    BorrarProductoComponent,
    SidebarMenuComponent,
    VerProductosModalComponent,
    VerFacturasCajeroComponent,
    VerCierresCajeroComponent,
    VerFacturasCierreComponent,
    VerFacturasCierreCajeroComponent,
    VerFacturasBorradasComponent,
    ConfirmDialogComponent,
    ConfirmDialogBorrarFacturaComponent,
    VerModInfoFactComponent,
    SidebarAdminMenuComponent,
    ResetPasswordComponent,
    VerFacturasAdminComponent,
    VerFacturaModalComponent,
    VerFacturaBorradaModalComponent,
    MostrarFacturasCierreModalComponent,
    VerCierresMesComponent,
    AgregarCajeroComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    AngularFireStorageModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule
  ],
  exports:[UserInfoModalComponent],
  providers: [
    
    provideClientHydration(),
    AuthGuard,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
