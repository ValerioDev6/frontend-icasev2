import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../../../core/services/common/auth.service';
import { CheckStatusResponse } from '../../../../core/interfaces/get-status.interface';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import Swal from 'sweetalert2';
import { PersonasService } from '../../../../core/services/personas.service';

@Component({
	selector: 'app-main-layout',
	standalone: true,
	imports: [
		RouterLink,
		RouterOutlet,
		NzIconModule,
		NzLayoutModule,
		NzMenuModule,
		NzInputModule,
		NzBadgeModule,
		NzAvatarModule,
		NzDropDownModule,
		CommonModule,
		NzBreadCrumbModule,
		NzToolTipModule,
		RouterLinkActive,
	],
	templateUrl: './main-layout.component.html',
	styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
	personal: CheckStatusResponse | null = null;
	isCollapsed = false;
	private readonly _authService = inject(AuthService);
	private readonly personaServie = inject(PersonasService);

	ngOnInit(): void {
		this._authService.checkAuthStatus().subscribe((response: CheckStatusResponse) => {
			this.personal = response;
		});
	}

	logout() {
		Swal.fire({
			title: '¿Estás seguro de cerrar sesión?',
			html: `
        <div class="flex flex-col items-center space-y-4">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
          <p class="text-gray-600">Confirma si realmente deseas salir del sistema</p>
        </div>
      `,
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Sí, cerrar sesión',
			cancelButtonText: 'Cancelar',
			customClass: {
				popup: 'rounded-xl shadow-xl',
				title: 'hidden',
				htmlContainer: 'p-0',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: 'Cerrando sesión...',
					html: `
            <div class="flex flex-col items-center space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <p class="text-gray-600">Por favor, espere un momento</p>
            </div>
          `,
					showConfirmButton: false,
					allowOutsideClick: false,
					didOpen: () => {
						setTimeout(() => {
							this._authService.logout();

							Swal.fire({
								icon: 'success',
								title: 'Sesión cerrada',
								text: 'Has cerrado sesión exitosamente',
								timer: 2000,
								showConfirmButton: false,
							});
						}, 1500);
					},
				});
			}
		});
	}
}
