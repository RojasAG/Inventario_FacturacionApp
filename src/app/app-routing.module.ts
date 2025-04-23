import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPrincipalComponent } from './login-principal/login-principal.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { MenuCajeroComponent } from './menu-cajero/menu-cajero.component';
import { AuthGuard } from './services/auth-guard.service';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { VerProductosComponent } from './ver-productos/ver-productos.component';
import { VerFacturasComponent } from './ver-facturas/ver-facturas.component';
import { VerCierresComponent } from './ver-cierres/ver-cierres.component';
import { VerFacturasCajeroComponent } from './ver-facturas-cajero/ver-facturas-cajero.component';
import { VerCierresCajeroComponent } from './ver-cierres-cajero/ver-cierres-cajero.component';
import { VerFacturasCierreComponent } from './ver-facturas-cierre/ver-facturas-cierre.component';
import { VerFacturasCierreCajeroComponent } from './ver-facturas-cierre-cajero/ver-facturas-cierre-cajero.component';
import { VerFacturasBorradasComponent } from './ver-facturas-borradas/ver-facturas-borradas.component';
import { VerModInfoFactComponent } from './ver-mod-info-fact/ver-mod-info-fact.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerFacturasAdminComponent } from './ver-facturas-admin/ver-facturas-admin.component';
import { VerCierresMesComponent } from './ver-cierres-mes/ver-cierres-mes.component';
import { AgregarCajeroComponent } from './agregar-cajero/agregar-cajero.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPrincipalComponent },
  {
    path: 'menu-principal',
    component: VerFacturasComponent, // Contiene el sidebar y el router-outlet
    canActivate: [AuthGuard],
    children: [
      { path: 'ver-productos', component: VerProductosComponent },
      { path: 'ver-facturas-admin', component: VerFacturasAdminComponent },
      { path: 'ver-cierres', component: VerCierresComponent },
      { path: 'ver-facturas-borradas', component: VerFacturasBorradasComponent },
      { path: 'ver-info-fact', component: VerModInfoFactComponent },
      { path: 'ver-cierres-mes', component: VerCierresMesComponent },
      { path: 'agregar-cajero', component: AgregarCajeroComponent },
      { path: '', redirectTo: 'ver-productos', pathMatch: 'full' }, // Ruta por defecto
    ]
  },

  { path: 'login/reset-password', component: ResetPasswordComponent },
  { path: 'menu-cajero', component: MenuCajeroComponent, data: { animation: 'MenuCajeroPage' }, canActivate: [AuthGuard] },
  { path: 'menu-cajero/ver-factura-cajero', component: VerFacturasCajeroComponent, canActivate: [AuthGuard] },
  { path: 'menu-cajero/ver-cierres', component: VerCierresCajeroComponent, canActivate: [AuthGuard] },
  { path: 'menu-cajero/ver-cierres/ver-facturas-cierre-cajero', component: VerFacturasCierreCajeroComponent,  data: { animation: 'VerFacturasCierreCajeroPage' }, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

/*
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  //{ path: '', component: LoginPrincipalComponent },
  { path: 'login', component: LoginPrincipalComponent },
  { path: 'menu-principal', component: MenuPrincipalComponent, data: { animation: 'MenuPrincipalPage' }, canActivate: [AuthGuard] },
  { path: 'menu-cajero', component: MenuCajeroComponent, data: { animation: 'MenuCajeroPage' }, canActivate: [AuthGuard] },
  { path: 'menu-cajero/ver-factura-cajero', component: VerFacturasCajeroComponent, canActivate: [AuthGuard] },
  { path: 'menu-principal/agregar-producto', component: AgregarProductoComponent,canActivate: [AuthGuard] },
  { path: 'menu-principal/ver-productos', component: VerProductosComponent, canActivate: [AuthGuard] },
  { path: 'menu-principal/ver-facturas', component: VerFacturasComponent, canActivate: [AuthGuard] },
  { path: 'menu-principal/ver-cierres', component: VerCierresComponent, canActivate: [AuthGuard] },
  { path: 'menu-principal/ver-facturas-borradas', component: VerFacturasBorradasComponent, canActivate: [AuthGuard] },
  { path: 'menu-cajero/ver-cierres', component: VerCierresCajeroComponent, canActivate: [AuthGuard] },
  { path: 'menu-principal/ver-cierres/ver-facturas-cierre', component: VerFacturasCierreComponent,  data: { animation: 'VerFacturasCierrePage' }, canActivate: [AuthGuard] },
  { path: 'menu-cajero/ver-cierres/ver-facturas-cierre-cajero', component: VerFacturasCierreCajeroComponent,  data: { animation: 'VerFacturasCierreCajeroPage' }, canActivate: [AuthGuard] },
  { path: 'menu-principal/ver-info-fact', component: VerModInfoFactComponent,  data: { animation: 'VerModInfoFactPage' }, canActivate: [AuthGuard] },
  { path: 'login/reset-password', component: ResetPasswordComponent,  data: { animation: 'ResetPasswordPage' } },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },

];
*/

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
